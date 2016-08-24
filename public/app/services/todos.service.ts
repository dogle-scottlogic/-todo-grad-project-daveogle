import { Todo } from "../components/todos.component";
import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import "rxjs/add/operator/toPromise";

@Injectable()
export class TodoService {

    private todosUrl = "api/todo/";

    constructor(private http: Http) { }

    // Get
    public getTodos(): Promise<Response> {
        return this.http.get(this.todosUrl)
               .toPromise()
               .catch(this.handleError);
    }

    public getLatestChangeId(): Promise<Response> {
        return this.http.get("/api/changed")
               .toPromise()
               .catch(this.handleError);
    }

    // Post
    public setTodo(todo: Todo): Promise<any> {
        return this.http
             .post(this.todosUrl, JSON.stringify(todo), {headers: new Headers({"Content-Type": "application/json"})})
             .toPromise()
             .then((res) => res)
             .catch(this.handleError);
     }

     // Delete
     public removeTodo(id: number): Promise<Response> {
         let deleteUrl = this.todosUrl + id;
         return this.http.delete(deleteUrl, {body: "", headers: new Headers({"Content-Type": "application/json"})})
         .toPromise()
         .catch(this.handleError);
     }

     public removeComplete(): Promise<Response> {
         let deleteUrl = this.todosUrl + "complete";
         return this.http.delete(deleteUrl, {body: "", headers: new Headers({"Content-Type": "application/json"})})
         .toPromise()
         .catch(this.handleError);
     }

     // Put
     public updateTodo(todo: Todo): Promise<any> {
         let putUrl = this.todosUrl + todo.id;
         return this.http
              .put(putUrl, JSON.stringify(todo), {headers: new Headers({"Content-Type": "application/json"})})
              .toPromise()
              .then(res => res)
              .catch(this.handleError);
     }

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);
        return Promise.reject(error.message || error);
    }
}
