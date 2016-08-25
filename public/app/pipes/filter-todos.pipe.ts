import { Todo } from "../components/todos.component";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "filterTodos", pure: false})
export class FilterTodos implements PipeTransform {
  public transform(list: Todo[], filterWord: string): Todo[] {
      switch (filterWord) {
          case "Complete":
            return list.filter(todo => todo.isComplete === true);
          case "Incomplete":
            return list.filter(todo => todo.isComplete !== true);
          default:
            return list;
      }
  }
}
