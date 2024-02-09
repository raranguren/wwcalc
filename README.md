# Wwcalc - A Werewolf balance calculator

## Demo

The app is currently running on [this page](https://raranguren.github.io/wwcalc/)

## Introduction

Hosting a game of [Werewolf](https://simple.wikipedia.org/wiki/Social_deduction_game) for your online community can be challenging. Not only do you need to apply the rules correctly, keep track of deadlines for each round, and manage the votes during the day phase, as well as the effects during the night phase, but it is also your responsibility as the game master to create a setup that is enjoyable for most participants.

Those who have played many games of Werewolf may recall instances where the wolves had it too easy, or conversely, had no chance. While these games can be entertaining, the fundamental principle of this kind of game is to demonstrate that **an informed minority has an advantage over an uninformed majority**. 

This simulator attempts to illustrate, in a simplified manner, the effects that different team sizes can have. This way, as the game master, you can make an informed decision.

Try to balance the number of roles so that the village has a slight advantage, but the wolves still have a chance to win.

## Technical details

This project served as a small-scale experiment to explore standalone components and using signals for state management.

Technologies:
- Angular 17
- Typescript, HTML, CSS
- Jest (with [Jest-Icov coverage report](https://raranguren.github.io/wwcalc/coverage/))
- GitHub CI/CD to GitHub Pages
