import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./todos/todos-routing.module').then(m => m.TodosRoutingModule)
  }
];
