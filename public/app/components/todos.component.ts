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
    pageLoaded = false;

    constructor(private todoService: TodoService) { }

    getTodos(): void {
        this.todoService
            .getTodos()
            .then( result => this.todos = result);
    }

    addTodo(todo: Todo): void {
        this.todoService.setTodo(todo)
        .then( result => result.status === 201 ? this.pushTodo(todo, result.headers.get("Id")) : console.log("Error"));
    }

    private pushTodo(todo: Todo, id: number): void{
        todo.id = id;
        this.todos.push(todo);
    }

    deleteTodo(id: number): void {
        this.todoService.removeTodo(id)
        .then( result => result.status === 200 ? this.todos = this.todos.filter(todo => todo.id != id) : console.log("Error"));
    }

    completeTodo(id: number): void {
        let elementPos = this.todos.map(function(x) {return x.id; }).indexOf(id);
        let updateTodo = this.todos[elementPos];
        updateTodo.isComplete = true;
        this.todoService.updateTodo(updateTodo)
        .then( result => result.status === 200 ? this.todos[elementPos].isComplete = true : console.log("Error"));
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
        this.pageLoaded = true;
    }
}
