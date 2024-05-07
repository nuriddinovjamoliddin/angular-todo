import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      }, {
        path: 'list',
        loadComponent: () => import('./pages/todos-list/todos-list.component').then(m => m.TodosListComponent)
      }, {
        path: 'add',
        loadComponent: () => import('./pages/add-todo/add-todo.component').then(m => m.AddTodoComponent)
      }, {
        path: 'favorite',
        loadComponent: () => import('./pages/favourites/favourites.component').then(m => m.FavouritesComponent)
      }
    ])
  ],
})
export class TodosRoutingModule {}
