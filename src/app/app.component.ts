import { Component } from '@angular/core';
import axios from 'axios';

interface Todo {
  id: number;
  content: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  template: `
  <h3>My Google Maps Demo</h3>
  <input type="text" placeholder="Enter Location!"
    (keyup.enter)="findLocation($event.target.value)" [(ngModel)]="location">
  <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
  <agm-marker [latitude]="lat" [longitude]="lng">
  <agm-info-window>위도(lat):{{lat}}, 경도(lng):{{lng}}</agm-info-window>
  </agm-marker>
  </agm-map>
  <input type="text" placeholder="Enter Todo!"
    (keyup.enter)="addTodo($event.target.value)" [(ngModel)]="listcontent">
  <ul>
    <li *ngFor="let todo of todos">
    <input type="checkbox" [checked]="todo.completed" (change)="changeState(todo.id)">
    {{todo.content}}
    <button (click)="removeTodos(todo.id)">X</button>
    </li>
  </ul>
  <input type="checkbox" (change)="toggleAllTodos(checkState)">Toggle all
  <button class="clear-btn" (click)="removeSlected()">clear</button>
  <pre>{{todos | json}}</pre>
  `
  ,
  styles: [`
  * {
    padding: 0;
    margin: 0;
  }

  agm-map {
  height: 300px;
  }

  button {
    width: 20px;
    height: 20px;
  }

  .clear-btn {
    width: 50px;
    height: 20px;
  }

  li {
    color: blue;
    list-style: none;
  }
  `]
})

export class AppComponent {
  title = 'app';
  todos: Todo[] = [];
  listcontent = '';
  checkState = true;
  lat = 37.49794199999999;
  lng = 127.027621;
  zoom = 20;

  location: string;
  findLocation (location: string) {
      this.location = location;
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: 'AIzaSyCxXp7uUGDn2FCzjDg5j5Z-AQlCxcTLOdM'
        }
      })
        .then(response => {
          console.log(response);
          console.log(response.data.results[0].geometry.location);
          this.lat = response.data.results[0].geometry.location.lat;
          this.lng = response.data.results[0].geometry.location.lng;
        })
        .catch(error => {
          console.log(error);
        });
      }

  addTodo(content: string) {
    const newTodo = { id: this.nextIndexTodos(), content, completed: false };
    this.todos = [...this.todos, newTodo];
    this.listcontent = '';
  }

  changeState(id: number) {
    this.todos = this.todos.map(todo => {
      return todo.id === id ? Object.assign({}, todo, {completed: !todo.completed}) : todo;
    });
  }

  removeTodos(id: number) {
    this.todos = this.todos.filter(todo => {
      return todo.id !== id;
    });
  }

  toggleAllTodos(completedState: boolean) {
    this.checkState = !this.checkState;
    this.todos = this.todos.map(todo => {
      return Object.assign({}, todo, { completed: completedState});
    });
  }

  removeSlected() {
    this.todos = this.todos.filter(todo => {
      return !todo.completed;
    });
  }

  nextIndexTodos() {
    return this.todos.length ? Math.max(...this.generateId()) + 1 : 1 ;
  }

  generateId() {
    if (!this.todos.length) { return; }
    return this.todos.map(todo => todo.id);
  }

}

