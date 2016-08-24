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
var app_todo_service_1 = require("./app.todo.service");
var Todo = (function () {
    function Todo() {
    }
    return Todo;
}());
exports.Todo = Todo;
var AppComponent = (function () {
    function AppComponent(todoService) {
        this.todoService = todoService;
    }
    AppComponent.prototype.getHeros = function () {
        var _this = this;
        this.todoService.getTodos().then(function (todos) { return _this.todos = todos; });
    };
    AppComponent.prototype.onSelect = function (todo) {
        this.selectedTodo = todo;
    };
    AppComponent.prototype.ngOnInit = function () {
        this.getHeros();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            templateUrl: "/app/templates/todoList.html",
            providers: [app_todo_service_1.TodoService]
        }),
        __metadata('design:paramtypes', [app_todo_service_1.TodoService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map