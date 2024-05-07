import {Component, inject} from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from '@angular/material/table';
import {TodosService} from "../../../core/services/util/todos.service";
import {AsyncPipe} from "@angular/common";
import {ListItemTodoComponent} from "../../components/list-item-todo/list-item-todo.component";


@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    AsyncPipe,
    ListItemTodoComponent,
  ],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  private readonly todosService = inject(TodosService)

  public favourites$ = this.todosService.getFavouriteTodos()
}
