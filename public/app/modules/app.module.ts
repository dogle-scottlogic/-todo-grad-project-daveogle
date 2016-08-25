import { AppComponent }  from "../components/app.component";
import { TodosComponent }  from "../components/todos.component";
import { FilterTodos } from "../pipes/filter-todos.pipe";
import { TodoService }  from "../services/todos.service";
import { NgModule }      from "@angular/core";
import { FormsModule }   from "@angular/forms";
import { HttpModule }     from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        FilterTodos,
        TodosComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
    ],
    providers: [TodoService],
})
export class AppModule { }
