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
    }
    return Todo;
}());
exports.Todo = Todo;
var TodosComponent = (function () {
    function TodosComponent(todoService) {
        this.todoService = todoService;
        this.model = new Todo("");
        this.submitted = false;
        this.active = true;
    }
    TodosComponent.prototype.getTodos = function () {
        var _this = this;
        this.todoService
            .getTodos()
            .then(function (result) { return _this.todos = result; });
    };
    TodosComponent.prototype.addTodo = function (todo) {
        var _this = this;
        this.todoService.setTodo(todo)
            .then(function (result) { return result._body === "Created" ? _this.todos.push(todo) : console.log("Error"); });
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
    TodosComponent.prototype.ngOnInit = function () {
        this.getTodos();
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