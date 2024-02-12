import { Injectable, isDevMode } from "@angular/core";

/**
 * This service runs jobs in the background, 
 * making sure that there are never two jobs running at the same time.
 */
@Injectable({
  providedIn: 'root'
})
export class JobScheduler {

  /** Continuosly runs jobs */
  private async startScheduler() {
    if (isDevMode()) console.debug("Running jobs...");
    while (this._jobs.length > 0) {
      try {
        await Promise.all(this._jobs.map(job => job()));
      } catch (e) {
        if (isDevMode()) console.warn("[JobSchedulerService] Job failed", e);
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  /** The jobs running */
  private _jobs: (()=>void)[] = [];

  /** Adds a job that starts running in the background right away */
  addJob(job: () => void) {
    this._jobs.push(job);
    if (this._jobs.length == 1) this.startScheduler();
  }

  /** Removes all jobs */
  stopAllJobs() {
    this._jobs = [];
  }

}