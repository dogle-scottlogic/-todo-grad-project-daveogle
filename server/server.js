var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");

module.exports = function(port, middleware, callback) {
    var app = express();

    if (middleware) {
        app.use(middleware);
    }
    app.use(express.static("public"));
    app.use(bodyParser.json());

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
    });

    // Read
    app.get("/api/todo", function(req, res) {
        res.json(todos);
    });

    // Delete
    app.delete("/api/todo/:id", function(req, res) {
        var deleted;
        var id = req.params.id;
        if (id === "complete") {
            deleteComplete();
            res.sendStatus(200);
        }
        else {
            deleted = deleteTodo(id);
            if (deleted) {
                res.sendStatus(200);
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
        var toRemove = [];
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].isComplete) {
                toRemove.push(todos[i].id);
            }
        }
        for (var j = 0; j < toRemove.length; j++) {
            deleteTodo(toRemove[j]);
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
