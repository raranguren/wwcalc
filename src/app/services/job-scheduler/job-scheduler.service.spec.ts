import { TestBed } from "@angular/core/testing";
import { JobScheduler } from "./job-scheduler.service"

describe('JobSchedulerService', () => {
  let service: JobScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobScheduler);
  });

  it('Should run jobs repeatedly and be stoppable', () => {
    let timer = 0;
    const job = () => {
      timer++;
      if (timer == 2) service.stopAllJobs;
    }
    service.addJob(job);
    setTimeout(() => {
      expect(timer).toBe(2);
    }, 100);
  });
})