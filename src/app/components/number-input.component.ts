import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'app-number-input',
  standalone: true,

  template: `
      <button (click)="decrease($event)">-</button>
      <input
              type="number"
              [value]="value"
              (input)="onInput($event)">
      <button (click)="increase($event)">+</button>
  `
})
export class NumberInputComponent {
  @Input() labelText: string = '';
  @Input() value: number = 0;

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;
    const value = Number(inputValue);
    if (!isNaN(value)) {
      this.valueChange.emit(value);
    }
  }

  decrease(event: Event) {
    event.preventDefault();
    if (this.value <= 0) return;
    this.value--;
    this.valueChange.emit(this.value);
  }

  increase(event: Event) {
    event.preventDefault()
    this.value++;
    this.valueChange.emit(this.value);
  }

}
