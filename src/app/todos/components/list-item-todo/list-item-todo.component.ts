import {Component, inject, input} from '@angular/core';
import {ITodo} from "../../../core/types/todo.interface";
import {TodosService} from "../../../core/services/util/todos.service";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-list-item-todo',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './list-item-todo.component.html',
  styleUrl: './list-item-todo.component.scss'
})
export class ListItemTodoComponent {
  public requestProcessing = false
  public readonly todo = input.required<ITodo>()
  public readonly todoService = inject(TodosService)

  private readonly subs: Subscription[] = []

  public get timeLeft(): string {
    const { d, h, m } = this.computedTimeLeft
    return `${d}d ${h}h ${m}m`
  }

  public get criticallyUrgent(): boolean {
    const { d, h, m } = this.computedTimeLeft
    return d < 1 && h < 1
  }

  private get computedTimeLeft(): { d: number, h: number, m: number } {
    const timeLeft = new Date(this.todo().timeLeft).getTime() - Date.now()

    return {
      d: Math.floor(timeLeft / 1000 / 60 / 60 / 24),
      h: Math.floor(timeLeft / 1000 / 60 / 60) % 24,
      m: Math.floor(timeLeft / 1000 / 60) % 60,
    }
  }

  public like(): void {
    this.requestProcessing = true
    this.subs.push(
      this.todoService.toggleFavourite(this.todo().id).subscribe({
        next: () => {
          this.requestProcessing = false
        },
        error: () => {
          this.requestProcessing = false
        }
      })
    )
  }

  public delete(): void {
    this.requestProcessing = true
    this.subs.push(
      this.todoService.deleteTodoById(this.todo().id).subscribe({
        next: () => {
          this.requestProcessing = false
        },
        error: () => {
          this.requestProcessing = false
        }
      })
    )
  }
}
