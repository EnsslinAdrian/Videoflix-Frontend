import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypographyComponent } from "../typography/typography.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-toast',
  imports: [TypographyComponent, CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss'
})
export class ErrorToastComponent {
@Input() showErrorToast: boolean = true;
@Input() errorOrCorrect: 'error' | 'correct' = 'error';
@Input() toastMessage: string = '';
@Output() showErrorToastChange = new EventEmitter<boolean>();

/**
 * Emits the current state of the error toast visibility.
 * Typically used to notify parent components about the visibility change.
 */
closeErrorToast() {
  this.showErrorToastChange.emit(this.showErrorToast);
}

}
