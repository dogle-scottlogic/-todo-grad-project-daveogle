"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var TodoService = (function () {
    function TodoService(http) {
        this.http = http;
        this.todosUrl = "api/todo/";
    }
    // Get
    TodoService.prototype.getTodos = function () {
        return this.http.get(this.todosUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    // Post
    TodoService.prototype.setTodo = function (todo) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.todosUrl, JSON.stringify(todo), { headers: headers })
            .toPromise()
            .then(function (res) { return res; })
            .catch(this.handleError);
    };
    // Delete
    TodoService.prototype.removeTodo = function (id) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var deleteUrl = this.todosUrl + id;
        return this.http.delete(deleteUrl, { headers: headers, body: "" })
            .toPromise()
            .catch(this.handleError);
    };
    // Put
    TodoService.prototype.updateTodo = function (todo) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var putUrl = this.todosUrl + todo.id;
        return this.http
            .put(putUrl, JSON.stringify(todo), { headers: headers })
            .toPromise()
            .then(function (res) { return res; })
            .catch(this.handleError);
    };
    TodoService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    TodoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TodoService);
    return TodoService;
}());
exports.TodoService = TodoService;
//# sourceMappingURL=todos.service.js.map