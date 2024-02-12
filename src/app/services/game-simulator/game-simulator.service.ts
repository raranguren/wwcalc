import {Injectable, computed, inject, signal} from '@angular/core';
import {Game} from "../../models/game";
import {Team} from "../../models/team";
import {JobScheduler} from "../job-scheduler/job-scheduler.service";

/**
 * This service exposes the state of the application in the form of signals.
 * Some signals are settings for the simulation and can be set. 
 * Others are computed signals and provide statistics about the games already simulated.
 * A background process continuosly simulates games and update the state.
 */
@Injectable({
  providedIn: 'root'
})
export class GameSimulator {

  scheduler = inject(JobScheduler);

  constructor() {
    this.scheduler.addJob(this.backgroundJob);
  }

  /** The game setup that is being simulated. Simulations restart when this is modified. */
  game = signal(new Game(10,2, 2, 2));

  /** All the games simulated. They have ended with a winner, number of days, etc. */
  results = signal<Game[]>([]);

  /** @readonly The percent of games won by the Village team */
  winRate = computed(() => {
    const results = this.results();
    const wins = results.filter(game => game.winner == Team.VILLAGE).length;
    return wins / results.length;
  })

  /** 
   * @readonly 
   * More detailed stats for the games simulated.
   * The map keys are the number of days that the game lasted. 
   * The values are the percentage of games won by each of the teams.
   */
  stats = computed(() => {
    const results = this.results();
    const totalGames = results.length;
    let longestGame = 0;
    let shortestGame = Infinity;
    const winCounts = new Map<number, Map<Team, number>>();
    for (const game of results) {
      const duration = game.days;
      if (duration > longestGame) longestGame = duration;
      if (duration < shortestGame) shortestGame = duration;
      const count = winCounts.get(duration) || new Map<Team, number>();
      const team = game.winner;
      if (team === undefined) continue;
      const wins = count.get(team) || 0;
      count.set(team, wins + 1);
      winCounts.set(duration, count);
    }
    const stats = new Map<number, Map<Team, number>>();
    for (let days = shortestGame; days <= longestGame; days++) {
      const villageWinCount = winCounts.get(days)?.get(Team.VILLAGE) || 0;
      const wolvesWinCount = winCounts.get(days)?.get(Team.WOLVES) || 0;
      const villageWinRate = villageWinCount / totalGames;
      const wolvesWinRate = wolvesWinCount / totalGames;
      stats.set(days, new Map([[Team.VILLAGE,villageWinRate],[Team.WOLVES,wolvesWinRate]]));
    }
    return stats;
  })

  /** @readonly The number of players in the settings */
  countPlayers = computed(() => {
    return this.game().players;
  });

  /** @readonly The number of players that are against the village team */
  countEvil = computed(() => {
    return this.game().wolves;
  });

  /** Restarts the simulation with new game settings, erasing all statistics */
  restart(game: Game) {
    this.game.set(game);
    this.results.set([]);
  }

  /** Job to run using the job scheduler */
  backgroundJob = () => {
    if (this.results().length >= 10000) return;
    const game = this.game().clone();
    while (!game.ended) game.advance();
    this.results.update(results => [...results, game]);
  }

}
