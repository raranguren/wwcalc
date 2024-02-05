import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'app-number-input',
  standalone: true,

  template: `
      <button (click)="onIncrease($event,-1)">-</button>
      <input
              type="text" inputmode="numeric" pattern="[0-9]*"
              [value]="value"
              (input)="onInput($event)">
      <button (click)="onIncrease($event, 1)">+</button>
  `
})
export class NumberInputComponent {
  @Input() labelText: string = '';
  @Input() value: number = 0;

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;
    this.updateAndEmitValue(Number(inputValue));
  }

  onIncrease(event: Event, increase:number) {
    event.preventDefault();
    this.updateAndEmitValue(this.value + increase);
  }

  updateAndEmitValue(newValue:number) {
    if (isNaN(newValue)) return;
    if (newValue < 0) return;
    if (newValue == this.value) return;
    this.value = newValue;
    this.valueChange.emit(this.value);
  }

}
