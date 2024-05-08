import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {
  public burgerOpen = false

  public toggleBurger(): void {
    this.burgerOpen = !this.burgerOpen
  }
}
