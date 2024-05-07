import {inject, Injectable} from "@angular/core";
import {combineLatest, first, map, Observable, switchMap, tap} from "rxjs";
import {StorageMap} from "@ngx-pwa/local-storage";
import {ITodo} from "../../types/todo.interface";
import {TodoListSchema} from "../../schemas/todo.schema";
import {CreateTodoInterface} from "../../types/create-todo.interface";
import {nanoid} from 'nanoid'
import {UpdatableCache} from "../../../classes/util/updatable-cache";

export enum STORAGE_KEYS {
  TODOS = 'todos',
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private readonly storage = inject(StorageMap)
  private readonly todos$ = new UpdatableCache<ITodo[]>(
    this.storage.get<ITodo[]>(STORAGE_KEYS.TODOS, TodoListSchema).pipe(
        map(todos => todos ?? [])
    )
  )

  public getAllTodos(): Observable<ITodo[]> {
    return this.todos$.getState()
  }

  public getTodoById(id: string): Observable<ITodo | undefined> {
    return this.getAllTodos().pipe(
      map(todos => todos.find(todo => todo.id === id))
    )
  }

  public addTodo(todo: CreateTodoInterface): Observable<void> {
    return this.getAllTodos().pipe(
      first(),
      switchMap((todosList) => {
        const newTodo: ITodo = {
          ...todo,
          id: nanoid(),
          completed: false,
          favourite: false,
          createdAt: new Date().toISOString(),
        }
        return this.storage.set(STORAGE_KEYS.TODOS, [...todosList, newTodo]).pipe(
          switchMap(() => this.todos$.update()),
          map(() => undefined)
        )
      })
    )
  }

  public deleteTodoById(id: string): Observable<void> {
    return this.getAllTodos().pipe(
      first(),
      switchMap(todos => {
        const updatedTodos = todos.filter(todo => todo.id !== id)
        return this.storage.set(STORAGE_KEYS.TODOS, updatedTodos).pipe(
          switchMap(() => this.todos$.update()),
          tap((a) => console.log(a.length)),
          map(() => undefined)
        )
      })
    )
  }

  public getTodayTodos(): Observable<ITodo[]> {
    return this.getAllTodos().pipe(
      map(todos => todos.filter(todo => {
        const dueDateMs = new Date(todo.timeLeft).getTime()
        const oneDayMs = 24 * 60 * 60 * 1000
        return dueDateMs - Date.now() < oneDayMs && dueDateMs - Date.now() > 0
      }))
    )
  }

  public getUpcomingTodos(): Observable<ITodo[]> {
    return combineLatest([
      this.getAllTodos(),
      this.getTodayTodos(),
    ]).pipe(
      map(([todos, todayTodos]) => {
        const todayTodosIds = todayTodos.map(todo => todo.id)
        return todos.filter(todo => !todayTodosIds.includes(todo.id))
      }),
    )
  }

  public getFavouriteTodos(): Observable<ITodo[]> {
    return this.getAllTodos().pipe(
      map(todos => todos?.filter(todo => todo.favourite) ?? [])
    )
  }

  public toggleFavourite(id: string): Observable<void> {
    return this.todos$.getState().pipe(
      first(),
      switchMap(todos => {
        const updatedTodos = todos.map((todo: ITodo) => {
          if (todo.id === id) {
            return {
              ...todo,
              favourite: !todo.favourite,
            }
          }
          return todo
        })
        return this.storage.set(STORAGE_KEYS.TODOS, updatedTodos).pipe(
          switchMap(() => this.todos$.update()),
          map(() => undefined)
        )
      })
    )
  }
}
