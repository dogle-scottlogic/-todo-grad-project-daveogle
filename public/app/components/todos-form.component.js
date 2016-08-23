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
var todos_component_1 = require('./todos.component');
var TodoFormComponent = (function () {
    function TodoFormComponent(todoService) {
        this.todoService = todoService;
        this.model = new todos_component_1.Todo("", 0, false);
        this.submitted = false;
        this.active = true;
    }
    TodoFormComponent.prototype.onSubmit = function () {
        console.log(this.model);
        this.submitted = true;
        todos_component_1.TodosComponent.addTodo();
        this.newTodo();
    };
    TodoFormComponent.prototype.newTodo = function () {
        var _this = this;
        this.model = new todos_component_1.Todo("", 0, false);
        this.active = false;
        setTimeout(function () { return _this.active = true; }, 0);
        console.log(this.model);
    };
    Object.defineProperty(TodoFormComponent.prototype, "diagnostic", {
        // TODO: Remove this when we're done
        get: function () { return JSON.stringify(this.model); },
        enumerable: true,
        configurable: true
    });
    TodoFormComponent = __decorate([
        core_1.Component({
            selector: 'todo-form',
            templateUrl: '/app/templates/todo-form.html'
        }), 
        __metadata('design:paramtypes', [Object])
    ], TodoFormComponent);
    return TodoFormComponent;
}());
exports.TodoFormComponent = TodoFormComponent;
//# sourceMappingURL=todos-form.component.js.map