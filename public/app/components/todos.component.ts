import { Component, OnInit } from "@angular/core";
import { TodoService } from "../services/todos.service";

export class Todo {
    id: number;
    isComplete: boolean;
    constructor(
        title: string
    ) {}
}

@Component({
  selector: "my-todos",
  templateUrl : "/app/templates/todoList.html"
})

export class TodosComponent implements OnInit {
    todos: Todo[];
    selectedTodo: Todo;
    error: any;
    model = new Todo("");
    submitted = false;
    active = true;

    constructor(private todoService: TodoService) { }

    getTodos(): void {
        this.todoService
            .getTodos()
            .then( result => this.todos = result);
    }

    addTodo(todo: Todo): void {
        this.todoService.setTodo(todo)
        .then( result => result._body === "Created" ? this.todos.push(todo) : console.log("Error"));
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

    ngOnInit(): void {
        this.getTodos();
    }
}
