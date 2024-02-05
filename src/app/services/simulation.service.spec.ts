import { TestBed } from "@angular/core/testing";
import { SimulationService } from "./simulation.service"
import { JobSchedulerService } from "./job-scheduler.service";

class MockJobSchedulerService {
    jobs: (() => void)[] = [];
    addJob(job: () => void) {this.jobs.push(job)};
    runOnce = () => this.jobs.forEach(job => job())
}

describe('SimulationService', () => {
  let service: SimulationService;
  let mockScheduler: MockJobSchedulerService;
  
  beforeEach(() => {
    mockScheduler = new MockJobSchedulerService();
    TestBed.configureTestingModule({
        providers: [
            {provide: JobSchedulerService, useValue: mockScheduler}
        ]
    }).compileComponents();
    service = TestBed.inject(SimulationService);
  });

  it('Should initialize with a default game', () => {
    expect(service.game).toBeTruthy();
  });

  it('Should use the job scheduler to run simulations in the background', () => {
    expect(mockScheduler.jobs.length > 0);
    expect(service.results().length).toBe(0);
  });

  it('Should add finished games to the statistics', () => {
    const resultsBefore = service.results();
    mockScheduler.runOnce();
    const resultsAfter = service.results();
    expect(resultsBefore.length).toBe(0);
    expect(resultsAfter.length).toBe(1);
    expect(resultsAfter[0].ended).toBeTruthy();
  });

})