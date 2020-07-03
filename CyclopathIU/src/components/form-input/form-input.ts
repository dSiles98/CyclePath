import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'form-input',
  templateUrl: 'form-input.html'
})
export class FormInputComponent {

  @Input() label: string;
  @Input() type: string;
  @Input() icon: string;
  @Output() formControl = new EventEmitter;
  @Input() value: string;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * return the value of the form field
   */
  emitValue()
  {
    this.formControl.emit(this.value);
  }
}
