import { Component, OnInit } from "@angular/core";
import { TodoService } from "../services/todos.service";

export class Todo {
  title: string;
  id: number;
  isComplete: boolean;
}

@Component({
  selector: "my-todos",
  templateUrl : "/app/templates/todoList.html"
})

export class TodosComponent implements OnInit {
    todos: Todo[];
    selectedTodo: Todo;
    error: any;

    constructor(private todoService: TodoService) { }

    getTodos(): void {
        this.todoService
            .getTodos()
            .then( result => this.todos = result);
    }

    onSelect(todo: Todo): void {
        this.selectedTodo = todo;
    }

    ngOnInit(): void {
        this.getTodos();
    }
}
