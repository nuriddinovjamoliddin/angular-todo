import {Component, HostListener, inject, input} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-back-btn',
  standalone: true,
  imports: [],
  templateUrl: './back-btn.component.html',
  styleUrl: './back-btn.component.scss'
})
export class BackBtnComponent {
  public handleClick = input<() => void>();
  public navigateOnCLick = input<boolean>(true)

  private readonly location = inject(Location)

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    this.handleClick()?.(); // perform if exists
    if (this.navigateOnCLick()) {
      this.location.back();
    }
  }
}
