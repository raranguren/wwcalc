import {Injectable, computed, signal} from '@angular/core';
import {Game} from "../models/game";
import {Team} from "../models/team";

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor() {
    setInterval(() => this.onTick(), 50);
  }

  game = signal(new Game(10,2));
  results = signal<Game[]>([]);
  winRate = computed(() => {
    const results = this.results();
    const wins = results.filter(game => game.winner == Team.VILLAGE).length;
    return wins / results.length;
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

  onTick() {
    if (this.results().length >= 1000) return;
    const game = this.game().clone();
    while (!game.ended) game.advance();
    this.results.update(results => [...results, game]);
  }

}
