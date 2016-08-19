var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var _ = require("underscore");
var fetch = require("whatwg-fetch");

module.exports = function(port, middleware, callback) {
    var app = express();

    if (middleware) {
        app.use(middleware);
    }
    app.use('/', express.static(__dirname + '/../public'));
    app.use('/lib', express.static(__dirname + '/../node_modules'));
    app.use(bodyParser.json());

    var changeId = 0;
    var latestId = 0;
    var todos = [];

    // Create
    app.post("/api/todo", function(req, res) {
        var todo = req.body;
        todo.id = latestId.toString();
        todo.isComplete = false;
        latestId++;
        todos.push(todo);
        res.set("Location", "/api/todo/" + todo.id);
        res.sendStatus(201);
        changeId++;
    });

    // Read
    app.get("/api/todo", function(req, res) {
        res.json(todos);
    });

    app.get("/api/changed", function(req, res) {
        res.json(changeId);
    });

    // Delete
    app.delete("/api/todo/:id", function(req, res) {
        var id = req.params.id;
        if (id === "complete") {
            deleteComplete();
            res.sendStatus(200);
            changeId++;
        }
        else {
            if (deleteTodo(id)) {
                res.sendStatus(200);
                changeId++;
            } else {
                res.sendStatus(404);
            }
        }
    });

    // Update
    app.put("/api/todo/:id", function(req, res) {
        var todo = getTodo(req.params.id);
        if (todo) {
            for (var param in req.body) {
                if (param !== "id") {
                    todo[param] = req.body[param];
                }
            }
            res.set("Location", "/api/todo/" + todo.id);
            res.sendStatus(200);
            changeId++;
        } else {
            res.sendStatus(404);
        }
    });

    function getTodo(id) {
        return _.find(todos, function(todo) {
            return todo.id === id;
        });
    }

    function deleteComplete() {
        for (var i = todos.length - 1; i >= 0; i--) {
            if (todos[i].isComplete) {
                todos.splice(i, 1);
            }
        }
    }

    function deleteTodo(id) {
        var todo = getTodo(id);
        if (todo) {
            todos = todos.filter(function(otherTodo) {
                return otherTodo !== todo;
            });
            return true;
        }
        return false;
    }

    var server = app.listen(port, callback);

    // We manually manage the connections to ensure that they're closed when calling close().
    var connections = [];
    server.on("connection", function(connection) {
        connections.push(connection);
    });

    return {
        close: function(callback) {
            connections.forEach(function(connection) {
                connection.destroy();
            });
            server.close(callback);
        }
    };
};
