import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TeamSelectorComponent } from "./team-selector.component";
import { Game } from "../models/game";
import { SimulationService } from "../services/simulation.service";

class MockSimulationService {
  game = () => new Game(2,1,0,0);
  restart = (game: Game) => {};
}

describe('TeamSelectorComponent', () => {
  let component: TeamSelectorComponent;
  let fixture: ComponentFixture<TeamSelectorComponent>;
  let mockSimulationService: MockSimulationService = new MockSimulationService();

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [TeamSelectorComponent],
      providers: [
        { provide: SimulationService, useValue: mockSimulationService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should restart the simulation on input change', () => {
    const restartSpy = jest.spyOn(mockSimulationService, 'restart');
    const inputElement = fixture.nativeElement.querySelector('app-number-input input');
    inputElement.value = '20';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(restartSpy).toHaveBeenCalledWith(expect.objectContaining({players: 20}));
  })

});