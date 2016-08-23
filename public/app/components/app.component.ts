import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <my-todos></my-todos>
  `
})

export class AppComponent {
  title = 'Todo Application';
}
