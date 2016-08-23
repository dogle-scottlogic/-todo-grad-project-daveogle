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
    function Todo() {
    }
    return Todo;
}());
exports.Todo = Todo;
var TodosComponent = (function () {
    function TodosComponent(todoService) {
        this.todoService = todoService;
    }
    TodosComponent.prototype.getTodos = function () {
        var _this = this;
        this.todoService
            .getTodos()
            .then(function (result) { return _this.todos = result; });
    };
    TodosComponent.prototype.onSelect = function (todo) {
        this.selectedTodo = todo;
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