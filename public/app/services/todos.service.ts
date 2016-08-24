import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Todo } from "../components/todos.component";
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TodoService {

    private todosUrl = "api/todo/";

    constructor(private http: Http) { }

    // Get
    getTodos(): Promise<Todo[]> {
        return this.http.get(this.todosUrl)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
    }

    // Post
    setTodo(todo: Todo): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.http
             .post(this.todosUrl, JSON.stringify(todo), {headers: headers})
             .toPromise()
             .then(res => res)
             .catch(this.handleError);
     }

     // Delete
     removeTodo(id: number): Promise<Response> {
         let headers = new Headers({'Content-Type': 'application/json'});
         let deleteUrl = this.todosUrl + id;
         return this.http.delete(deleteUrl, {headers: headers, body: ""})
         .toPromise()
         .catch(this.handleError);
     }

     // Put
     updateTodo(todo: Todo): Promise<any> {
         let headers = new Headers({"Content-Type": "application/json"});
         let putUrl = this.todosUrl + todo.id;
         return this.http
              .put(putUrl, JSON.stringify(todo), {headers: headers})
              .toPromise()
              .then(res => res)
              .catch(this.handleError);
     }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
