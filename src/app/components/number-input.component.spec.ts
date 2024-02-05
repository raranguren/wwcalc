import { TestBed } from '@angular/core/testing';
import { NumberInputComponent } from './number-input.component';

describe('NumberInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputComponent] // Import standalone component
    }).compileComponents();
  });

  it('should have default value 0', () => {
    const fixture = TestBed.createComponent(NumberInputComponent);
    const component = fixture.componentInstance;
    expect(component.value).toBe(0);
  });
  
  it('should emit value on user input', () => {
    const fixture = TestBed.createComponent(NumberInputComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component.valueChange, 'emit');
  
    const input = fixture.nativeElement.querySelector('input');
    input.value = '5';
    input.dispatchEvent(new Event('input'));
  
    expect(component.valueChange.emit).toHaveBeenCalledWith(5);
  });

  it('should accept zero as value', () => {
    const fixture = TestBed.createComponent(NumberInputComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component.valueChange, 'emit');
  
    const input = fixture.nativeElement.querySelector('input');
    input.value = '1';
    input.dispatchEvent(new Event('input'));
    input.value = '0';
    input.dispatchEvent(new Event('input'));

  
    expect(component.valueChange.emit).toHaveBeenCalledWith(0);
  });

  it('should not accept negative values', () => {
    const fixture = TestBed.createComponent(NumberInputComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component.valueChange, 'emit');
  
    const input = fixture.nativeElement.querySelector('input');
    input.value = '-100';
    input.dispatchEvent(new Event('input'));
  
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should not accept invalid numbers', () => {
    const fixture = TestBed.createComponent(NumberInputComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component.valueChange, 'emit');
  
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'nan';
    input.dispatchEvent(new Event('input'));
  
    expect(component.valueChange.emit).not.toHaveBeenCalled()
  });

});
