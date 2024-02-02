/** Represents the different phases of a game */
export enum Phase {
  SIGN_UP, // initial state of a game
  DAY, // after the sign-up phase or after a night
  NIGHT, // after a day
}
