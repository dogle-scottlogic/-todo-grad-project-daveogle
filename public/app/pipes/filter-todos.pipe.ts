import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from "../components/todos.component";

@Pipe({name: 'filterTodos', pure: false})
export class FilterTodos implements PipeTransform {
  transform(list: Todo[], filterWord: string): Todo[] {
      switch(filterWord)
      {
          case "Complete":
            return list.filter(todo => todo.isComplete === true);
          case "Incomplete":
            return list.filter(todo => todo.isComplete != true);
          default:
            return list;
      }
  }
}
