import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function noLessThanNowDateTimeFactory<T>(dateControlName: keyof T & string, timeControlName: keyof T & string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const date = group.get(dateControlName)?.value;
    const time = String(group.get(timeControlName)?.value).toLowerCase();
    const dateTime = new Date(date ?? '0-0-0');
    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]?.replaceAll(/\D/g, ''));
    dateTime.setHours(time.includes('pm') ? hours + 12 : hours);
    dateTime.setMinutes(minutes);

    return dateTime.getTime() < Date.now() ? { noLessThanNowDateTime: true } : null;
  }
}
