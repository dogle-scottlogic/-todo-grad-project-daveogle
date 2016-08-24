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
var core_1 = require("@angular/core");
var todos_service_1 = require("../services/todos.service");
var Todo = (function () {
    function Todo(title) {
        this.title = title;
    }
    return Todo;
}());
exports.Todo = Todo;
var Error = (function () {
    function Error() {
        this.isError = false;
    }
    return Error;
}());
exports.Error = Error;
var TodosComponent = (function () {
    function TodosComponent(todoService) {
        this.todoService = todoService;
        this.error = new Error();
        this.model = new Todo("");
        this.submitted = false;
        this.active = true;
        this.pageLoaded = false;
    }
    TodosComponent.prototype.getTodos = function () {
        var _this = this;
        this.todoService
            .getTodos()
            .then(function (result) { return result.status === 200 ? _this.todos = result.json() :
            _this.createError("Failed to get list. Server returned ", result.status, result.statusText); })
            .catch(function (result) { return _this.createError("Failed to get list. Server returned ", result.status, result.statusText); });
    };
    TodosComponent.prototype.addTodo = function (todo) {
        var _this = this;
        this.todoService.setTodo(todo)
            .then(function (result) { return result.status === 201 ? _this.pushTodo(todo, result.headers.get("Id")) :
            _this.createError("Failed to create item. Server returned ", result.status, result.statusText); })
            .catch(function (result) { return _this.createError("Failed to create item. Server returned ", result.status, result.statusText); });
    };
    TodosComponent.prototype.pushTodo = function (todo, id) {
        todo.id = id;
        this.todos.push(todo);
    };
    TodosComponent.prototype.deleteTodo = function (id) {
        var _this = this;
        this.todoService.removeTodo(id)
            .then(function (result) { return result.status === 200 ? _this.todos = _this.todos.filter(function (todo) { return todo.id != id; }) :
            _this.createError("Failed to delete item. Server returned ", result.status, result.statusText); })
            .catch(function (result) { return _this.createError("Failed to delete item. Server returned ", result.status, result.statusText); });
    };
    TodosComponent.prototype.completeTodo = function (id) {
        var _this = this;
        var elementPos = this.todos.map(function (x) { return x.id; }).indexOf(id);
        var updateTodo = this.todos[elementPos];
        updateTodo.isComplete = true;
        this.todoService.updateTodo(updateTodo)
            .then(function (result) { return result.status === 200 ? _this.todos[elementPos].isComplete = true :
            _this.createError("Failed to update item. Server returned ", result.status, result.statusText); })
            .catch(function (result) { return _this.createError("Failed to update item. Server returned ", result.status, result.statusText); });
    };
    TodosComponent.prototype.onSelect = function (todo) {
        this.selectedTodo = todo;
    };
    TodosComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.addTodo(this.model);
        this.newTodo();
    };
    TodosComponent.prototype.newTodo = function () {
        var _this = this;
        this.model = new Todo("");
        this.active = false;
        setTimeout(function () { return _this.active = true; }, 0);
    };
    TodosComponent.prototype.createError = function (message, code, text) {
        this.error.errorMessage = message;
        this.error.errorCode = code;
        this.error.errorText = text;
        this.error.isError = true;
    };
    TodosComponent.prototype.ngOnInit = function () {
        this.getTodos();
        this.pageLoaded = true;
    };
    TodosComponent = __decorate([
        core_1.Component({
            selector: "my-todos",
            templateUrl: "/app/templates/todoList.html"
        }), 
        __metadata('design:paramtypes', [todos_service_1.TodoService])
    ], TodosComponent);
    return TodosComponent;
}());
exports.TodosComponent = TodosComponent;
//# sourceMappingURL=todos.component.js.map