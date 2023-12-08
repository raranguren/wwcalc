import {Injectable, computed, signal} from '@angular/core';
import {Game} from "../models/game";
import {Team} from "../models/team";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor() {
    setInterval(() => this.onTick(), 10);
  }

  game = signal(new Game(10,2, 3, 2));
  results = signal<Game[]>([]);
  winRate = computed(() => {
    const results = this.results();
    const wins = results.filter(game => game.winner == Team.VILLAGE).length;
    return wins / results.length;
  })
  stats = computed(() => {
    const results = this.results();
    const totalGames = results.length;
    let longestGame = 0;
    let shortestGame = Infinity;
    const winCounts = new Map<number, Map<Team, number>>();
    for (let game of results) {
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

  countPlayers = computed(() => {
    return this.game().players;
  });

  countEvil = computed(() => {
    return this.game().wolves;
  });

  start(game: Game) {
    this.game.set(game);
    this.results.set([]);
  }

  private semaphore = true;
  onTick() {
    if (!this.semaphore) return;
    if (this.results().length >= 10000) return;
    this.semaphore = false;
    const game = this.game().clone();
    while (!game.ended) game.advance();
    this.results.update(results => [...results, game]);
    this.semaphore = true;
  }

}
