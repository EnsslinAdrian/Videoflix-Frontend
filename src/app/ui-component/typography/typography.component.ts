import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-typography',
  imports: [
    CommonModule
  ],
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss'
})
export class TypographyComponent {
  @Input() text: string = '';
  @Input() color: 'white' | 'black' | 'red' | 'green' | 'purple' = 'black';
  @Input() weight: 400 | 500 | 700 = 400;
  @Input() size: 'small' | 'medium' | 'x-medium' | 'medium-32' | 'large' | 'x-large' = 'medium';
  @Input() align: 'left' | 'center' | 'right' = 'left';

// <app-typography text="" size="medium" color="white" [weight]="400" [align]="'left'"></app-typography>
}
