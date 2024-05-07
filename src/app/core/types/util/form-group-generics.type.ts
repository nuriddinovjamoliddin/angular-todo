import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export type FormGroupFrom<T> = {
  [K in keyof T]: (
    | T[K]
    | ((control: AbstractControl<any, any>) => ValidationErrors | null)[]
    )[];
};

export type FormControlsFrom<T> = {
  [K in keyof T]: FormControl<T[K]>;
};
