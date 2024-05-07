import {Component, inject, OnDestroy} from '@angular/core';
import {BackBtnComponent} from "../../../shared/components/back-btn/back-btn.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormGroupFrom} from "../../../core/types/util/form-group-generics.type";
import {noLessThanNowDateTimeFactory} from "../../../core/validators/no-less-than-now-date-time-factory";
import {MatFormField} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatButton} from "@angular/material/button";
import {TodosService} from "../../../core/services/util/todos.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

export interface IAddTodo {
  title: string;
  expirationTime: string;
  expirationDate: string;
}

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    BackBtnComponent,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatButton,
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly todosService = inject(TodosService);
  private readonly router = inject(Router);
  private addTodoSub: Subscription | null = null;

  public readonly form = this.fb.group<FormGroupFrom<IAddTodo>>({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    expirationTime: ['6:00 PM', [Validators.required]],
    expirationDate: ['', [Validators.required]],
  }, {
    validators: [noLessThanNowDateTimeFactory<IAddTodo>('expirationDate', 'expirationTime')]
  });

  public get titleError(): string {
    if(!this.form.controls.title.touched) {
      return '';
    }

    if (this.form.controls.title.hasError('required')) {
      return 'Title is required';
    }

    if (this.form.controls.title.hasError('minlength')) {
      return 'Title is too short';
    }

    if (this.form.controls.title.hasError('maxlength')) {
      return 'Title is too long';
    }

    return '';
  }

  public get dateTimeError(): string {
    // console.log(this.form.hasError('noLessThanNowDateTime'));
    // console.log(this.form.controls)

    if (this.form.hasError('noLessThanNowDateTime') && this.form.controls.expirationDate.touched) {
      return 'Date and time must be in the future';
    }

    if(this.form.controls.expirationDate.touched && !this.form.controls.expirationDate.valid) {
      return 'Date is required';
    }

    if(this.form.controls.expirationTime.touched && !this.form.controls.expirationTime.valid) {
      return 'Time is required';
    }

    return '';
  }

  public formSubmit(): void {
    const date = this.form.controls.expirationDate.value;
    const time = String(this.form.controls.expirationTime.value).toLowerCase();
    const dateTime = new Date(date ?? '0-0-0');
    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]?.replaceAll(/\D/g, ''));
    dateTime.setHours(time.includes('pm') ? hours + 12 : hours);
    dateTime.setMinutes(minutes);

    this.addTodoSub = this.todosService.addTodo({
      title: this.form.controls.title.value ?? '',
      timeLeft: dateTime.toISOString(),
    }).subscribe(() => {
      this.router.navigate(['/']);
    })
  }

  public ngOnDestroy(): void {
    this.addTodoSub?.unsubscribe();
  }
}
