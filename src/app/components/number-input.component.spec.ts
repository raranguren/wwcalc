import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInputComponent } from './number-input.component';

describe('NumberInputComponent', () => {
  let fixture: ComponentFixture<NumberInputComponent>;
  let component: NumberInputComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputComponent] // Import standalone component
    }).compileComponents();
    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    input = fixture.nativeElement.querySelector('input');
    jest.spyOn(component.valueChange, 'emit');
  });

  it('should have default value 0', () => {
    expect(component.value).toBe(0);
  });
  
  it('should emit value on user input', () => {
    input.value = '5';
    input.dispatchEvent(new Event('input'));
    expect(component.valueChange.emit).toHaveBeenCalledWith(5);
  });

  it('should accept zero as value', () => {
    input.value = '1';
    input.dispatchEvent(new Event('input'));
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    expect(component.valueChange.emit).toHaveBeenCalledWith(0);
  });

  it('should not accept negative values', () => {
    input.value = '-100';
    input.dispatchEvent(new Event('input'));
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should not accept invalid numbers', () => {
    input.value = 'nan';
    input.dispatchEvent(new Event('input'));
    expect(component.valueChange.emit).not.toHaveBeenCalled()
  });

  it('should revert displayed value when rejecting a value', () => {
    input.value = '1';
    input.dispatchEvent(new Event('input'));
    const previousValue = input.value;
    input.value = 'invalid';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe(previousValue);
  });

});
