import { Component, OnInit } from "@angular/core";
import { TodoService } from "../services/todos.service";
import {Observable} from 'rxjs/Rx';

export class Todo {
    id: number;
    isComplete: boolean;
    title: string;
    constructor(
        title: string
    ) { this.title = title; }
}

export class Error {
    isError: boolean;
    errorMessage: string;
    errorCode: number;
    errorText: string;
    constructor() { this.isError = false; }
}

@Component({
  selector: "my-todos",
  templateUrl : "/app/templates/todoList.html"
})

export class TodosComponent implements OnInit {
    todos: Todo[] = [];
    selectedTodo: Todo;
    error: Error = new Error();
    model = new Todo("");
    submitted = false;
    active = true;
    pageLoaded = false;
    filterWord = "All";
    latestChangeId = 0;

    constructor(private todoService: TodoService) { }

    getTodos(): void {
        this.todoService
            .getTodos()
            .then( result => result.status === 200 ? this.todos = result.json() :
            this.createError("Failed to get list. Server returned ", result.status, result.statusText))
            .catch( result => this.createError("Failed to get list. Server returned ", result.status, result.statusText));
    }

    addTodo(todo: Todo): void {
        this.latestChangeId++;
        this.todoService.setTodo(todo)
        .then( result => result.status === 201 ? this.pushTodo(todo, result.headers.get("Id")) :
        this.createError("Failed to create item. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to create item. Server returned ", result.status, result.statusText));
    }

    private pushTodo(todo: Todo, id: number): void{
        todo.id = id;
        this.todos.push(todo);
    }

    deleteTodo(id: number): void {
        this.latestChangeId++;
        this.todoService.removeTodo(id)
        .then( result => result.status === 200 ? this.todos = this.todos.filter(todo => todo.id != id) :
        this.createError("Failed to delete item. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to delete item. Server returned ", result.status, result.statusText));
    }

    completeTodo(id: number): void {
        this.latestChangeId++;
        let elementPos = this.todos.map(function(x) {return x.id; }).indexOf(id);
        let updateTodo = this.todos[elementPos];
        updateTodo.isComplete = true;
        this.todoService.updateTodo(updateTodo)
        .then( result => result.status === 200 ? this.todos[elementPos].isComplete = true :
        this.createError("Failed to update item. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to update item. Server returned ", result.status, result.statusText));
    }

    onSelect(todo: Todo): void {
        this.selectedTodo = todo;
    }

    onSubmit() {
        this.submitted = true;
        this.addTodo(this.model);
        this.newTodo();
    }

    newTodo(){
          this.model = new Todo("");
          this.active = false;
          setTimeout(() => this.active = true, 0);
    }

    createError(message: string, code: number, text: string) {
        this.error.errorMessage = message;
        this.error.errorCode = code;
        this.error.errorText = text;
        this.error.isError = true;
        this.latestChangeId--;
    }

    countTodo() : number {
        return this.todos.filter(todo => todo.isComplete === false).length;
    }

    filter(filterWord: string) {
        this.filterWord = filterWord;
    }

    clearComplete() : void {
        this.todoService.removeComplete()
        .then( result => result.status === 200 ? this.todos = this.todos.filter(todo => !todo.isComplete) :
        this.createError("Failed to delete items. Server returned ", result.status, result.statusText))
        .catch( result => this.createError("Failed to delete item. Server returned ", result.status, result.statusText));
    }

    getLatestChange() : void {
        console.log("Called");
         this.todoService.getLatestChangeId()
         .then( result => result.status === 200 ? this.sync(result.text()) : console.log("Error fetching latest change"))
        .catch(result => console.log("Error fetching latest change"));
    }

    sync(serverLatestChange: string): void {
        if(parseInt(serverLatestChange) !== this.latestChangeId && this.latestChangeId !== 0) {
            this.getTodos();
        }
        this.latestChangeId = parseInt(serverLatestChange);
    }

    ngOnInit(): void {
        this.getTodos();
        this.pageLoaded = true;
        let timer = Observable.timer(10000, 10000);
        timer.subscribe(t => this.getLatestChange());
    }
}
