var server = require("../server/server");
var request = require("request");
var assert = require("chai").assert;

var testPort = 52684;
var baseUrl = "http://localhost:" + testPort;
var todoListUrl = baseUrl + "/api/todo";
var changeIdUrl = baseUrl + "/api/changed";

describe("server", function() {
    var serverInstance;
    beforeEach(function() {
        serverInstance = server(testPort);
    });
    afterEach(function() {
        serverInstance.close();
    });

    // Get
    describe("get list of todos", function() {
        it("responds with status code 200", function(done) {
            request(todoListUrl, function(error, response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
        it("responds with a body encoded as JSON in UTF-8", function(done) {
            request(todoListUrl, function(error, response) {
                assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
                done();
            });
        });
        it("responds with a body that is a JSON empty array", function(done) {
            request(todoListUrl, function(error, response, body) {
                assert.equal(body, "[]");
                done();
            });
        });
    });
    describe("get the current update", function() {
        it("responds with the current update number held on the server", function(done) {
            request(changeIdUrl, function(error, response, body) {
                assert.equal(body, 0);
                done();
            });
        });
    });
    // Post
    describe("create a new todo", function() {
        it("responds with status code 201", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function(error, response) {
                assert.equal(response.statusCode, 201);
                done();
            });
        });
        it("responds with the location of the newly added resource", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function(error, response) {
                assert.equal(response.headers.location, "/api/todo/0");
                done();
            });
        });
        it("inserts the todo at the end of the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function() {
                request.get(todoListUrl, function(error, response, body) {
                    assert.deepEqual(JSON.parse(body), [{
                        title: "This is a TODO item",
                        isComplete: false,
                        id: "0"
                    }]);
                    done();
                });
            });
        });
    });

    // Delete
    describe("delete a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.del(todoListUrl + "/0", function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
        it("responds with status code 200", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.del(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("removes the item from the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    isComplete: false
                }
            }, function() {
                request.del(todoListUrl + "/0", function() {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), []);
                        done();
                    });
                });
            });
        });
    });

    // Update
    describe("update a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.put(todoListUrl + "/0", function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
        it("responds with status code 200", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.put(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("responds with the location of the newly updated resource", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                    done: false
                }
            }, function() {
                request.put(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.headers.location, "/api/todo/0");
                    done();
                });
            });
        });
        it("updates the todo at the same point in the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function(error, response) {
                var oldId = response.headers.location[response.headers.location.length - 1];
                request.put({
                    url: todoListUrl + "/" + oldId,
                    json: {
                        title: "This is a updated Todo Item",
                    }
                }, function(error, response) {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), [{
                            title: "This is a updated Todo Item",
                            isComplete: false,
                            id: oldId
                        }]);
                        done();
                    });
                });
            });
        });
        it("does not update the id of a todo item", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function(error, response) {
                var oldId = response.headers.location[response.headers.location.length - 1];
                request.put({
                    url: todoListUrl + "/" + oldId,
                    json: {
                        id: "50",
                        title: "This is a updated Todo Item",
                        isComplete: true
                    }
                }, function(error, response) {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), [{
                            title: "This is a updated Todo Item",
                            isComplete: true,
                            id: oldId
                        }]);
                        done();
                    });
                });
            });
        });
    });

    // Delete all complete
    describe("delete all completed todos", function() {
        it("Removes one completed item", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a complete TODO item",
                }
            }, function() {
                request.put({
                    url: todoListUrl + "/0",
                    json: {
                        isComplete: true
                    }
                }, function() {
                    request.del(todoListUrl + "/complete", function() {
                        request.get(todoListUrl, function(error, response, body) {
                            assert.deepEqual(JSON.parse(body), []);
                            done();
                        });
                    });
                });
            });
        });
        it("Removes multiple completed item", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a complete TODO item",
                }
            }, function() {
                request.post({
                    url: todoListUrl,
                    json: {
                        title: "This is a second complete TODO item",
                    }
                }, function() {
                    request.put({
                        url: todoListUrl + "/0",
                        json: {
                            isComplete: true
                        }
                    }, function() {
                        request.put({
                            url: todoListUrl + "/1",
                            json: {
                                isComplete: true
                            }
                        }, function() {
                            request.del(todoListUrl + "/complete", function() {
                                request.get(todoListUrl, function(error, response, body) {
                                    assert.deepEqual(JSON.parse(body), []);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
        it("Removes no items if none are completed", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a complete TODO item",
                }
            }, function() {
                request.post({
                    url: todoListUrl,
                    json: {
                        title: "This is a second complete TODO item",
                    }
                }, function() {
                    request.del(todoListUrl + "/complete", function() {
                        request.get(todoListUrl, function(error, response, body) {
                            assert.deepEqual(JSON.parse(body), [{
                                title: "This is a complete TODO item",
                                isComplete: false,
                                id: "0"
                            }, {
                                title: "This is a second complete TODO item",
                                isComplete: false,
                                id: "1"
                            }]);
                            done();
                        });
                    });
                });
            });
        });
        it("Responds with 200 status code", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a complete TODO item",
                }
            }, function() {
                request.put({
                    url: todoListUrl + "/0",
                    json: {
                        isComplete: true
                    }
                }, function() {
                    request.del(todoListUrl + "/complete", function() {
                        request.get(todoListUrl, function(error, response, body) {
                            assert.equal(response.statusCode, 200);
                            done();
                        });
                    });
                });
            });
        });
    });
});
