import { TodoService } from "../services/todos.service";
import { Component, OnInit } from "@angular/core";
import {Observable} from "rxjs/Rx";

export class Todo {
    public id: number;
    public isComplete: boolean;
    public title: string;
    constructor(
        title: string
    ) { this.title = title; }
}

export class Error {
    public errorCode: number;
    public errorMessage: string;
    public errorText: string;
    public isError: boolean;

    constructor() { this.isError = false; }
}

@Component({
  selector: "my-todos",
  templateUrl : "/app/templates/todoList.html",
})

export class TodosComponent implements OnInit {
    public todos: Todo[] = [];
    public selectedTodo: Todo;
    public error: Error = new Error();
    public model = new Todo("");
    public pageLoaded = false;
    public filterWord = "All";
    private latestChangeId = 0;
    private submitted = false;
    private active = true;

    constructor(private todoService: TodoService) { }

    public getTodos(): void {
        this.todoService
            .getTodos()
            .then( result => result.status === 200 ? this.todos = result.json() :
            this.createError("Failed to get list. Server returned ", result.status, result.statusText))
            .catch( result => this.createError("Failed to get list. Server returned ", result.status, result.statusText));
    }

    public addTodo(todo: Todo): void {
        this.latestChangeId++;
        this.todoService.setTodo(todo)
        .then( result => result.status === 201 ? this.pushTodo(todo, result.headers.get("Id")) :
        this.createError("Failed to create item. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to create item. Server returned ", result.status, result.statusText));
    }

    public deleteTodo(id: number): void {
        this.latestChangeId++;
        this.todoService.removeTodo(id)
        .then( result => result.status === 200 ? this.todos = this.todos.filter(todo => todo.id !== id) :
        this.createError("Failed to delete list item. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to delete list item. Server returned ", result.status, result.statusText));
    }

    public completeTodo(id: number): void {
        this.latestChangeId++;
        let elementPos = this.todos.map(x => x.id).indexOf(id);
        let updateTodo = this.todos[elementPos];
        updateTodo.isComplete = true;
        this.todoService.updateTodo(updateTodo)
        .then( result => result.status === 200 ? this.todos[elementPos].isComplete = true :
        this.createError("Failed to update item. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to update item. Server returned ", result.status, result.statusText));
    }

    public onSelect(todo: Todo): void {
        this.selectedTodo = todo;
    }

    public onSubmit() {
        this.submitted = true;
        this.addTodo(this.model);
        this.newTodo();
    }

    public newTodo() {
          this.model = new Todo("");
          this.active = false;
          setTimeout(() => this.active = true, 0);
    }

    public createError(message: string, code: number, text: string) {
        this.error.errorMessage = message;
        this.error.errorCode = code;
        this.error.errorText = text;
        this.error.isError = true;
        this.latestChangeId--;
    }

    public countTodo(): number {
        return this.todos.filter(todo => todo.isComplete === false).length;
    }

    public filter(filterWord: string) {
        this.filterWord = filterWord;
    }

    public clearComplete(): void {
        this.todoService.removeComplete()
        .then( result => result.status === 200 ? this.todos = this.todos.filter(todo => !todo.isComplete) :
        this.createError("Failed to delete items. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to delete item. Server returned ", result.status, result.statusText));
    }

    public getLatestChange(): void {
         this.todoService.getLatestChangeId()
         .then( result => result.status === 200 ? this.sync(result.text()) : false)
        .catch();
    }

    public sync(serverLatestChange: string): void {
        if (parseInt(serverLatestChange, 10) !== this.latestChangeId && this.latestChangeId !== 0) {
            this.getTodos();
        }
        this.latestChangeId = parseInt(serverLatestChange, 10);
    }

    public ngOnInit(): void {
        this.getTodos();
        this.pageLoaded = true;
        let timer = Observable.timer(10000, 10000);
        timer.subscribe(t => this.getLatestChange());
    }

    private pushTodo(todo: Todo, id: number): void {
        todo.id = id;
        this.todos.push(todo);
    }
}
