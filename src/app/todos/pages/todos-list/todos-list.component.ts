import {Component, inject} from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from '@angular/material/table';
import {TodosService} from "../../../core/services/util/todos.service";
import {AsyncPipe} from "@angular/common";
import {ListItemTodoComponent} from "../../components/list-item-todo/list-item-todo.component";


@Component({
  selector: 'app-todos-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    AsyncPipe,
    ListItemTodoComponent,
  ],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})
export class TodosListComponent {
  private readonly todosService = inject(TodosService)

  public todayTodos$ = this.todosService.getTodayTodos()
  public upcomingTodos$ = this.todosService.getUpcomingTodos()
}
