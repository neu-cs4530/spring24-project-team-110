import Game from './Game';
import GameResult from './GameResult';

/**
 * A class to represent a user's game history.
 */
export default class GameHistory {
  private _games: GameResult[];

  private _gameToGameResult(games: Array<InstanceType<typeof Game>>): GameResult[] {
    return games.map(game => new GameResult(game.id, game.date, game.players, game.winner));
  }

  private _initialGamesType(initialGames: GameResult[] | Array<InstanceType<typeof Game>>): string {
    let type = '';
    if (initialGames[0] instanceof GameResult) {
      type = 'GameResult';
    } else if (initialGames[0] instanceof Game) {
      type = 'Game';
    } else {
      return type;
    }

    for (const game of initialGames) {
      if (
        (game instanceof GameResult && type === 'Game') ||
        (game instanceof Game && type === 'GameResult')
      ) {
        return '';
      }
    }

    return type;
  }

  public constructor(initialGames?: GameResult[] | Array<InstanceType<typeof Game>>) {
    this._games = [];
    if (initialGames && Array.isArray(initialGames)) {
      const type = this._initialGamesType(initialGames);
      if (type === 'Game') {
        this._games = this._gameToGameResult(initialGames as Array<InstanceType<typeof Game>>);
      } else if (type === 'GameResult') {
        this._games = initialGames as GameResult[];
      }
    }
  }

  /**
   * Add a game to the history
   * @param game The game to add to the history
   */
  public addGame(game: GameResult | InstanceType<typeof Game>) {
    if (game instanceof Game) {
      this._games.push(new GameResult(game.id, game.date, game.players, game.winner));
    } else {
      this._games.push(game);
    }
  }

  get games(): GameResult[] {
    return [...this._games];
  }

  /**
   * Add multiple games to the history
   * @param games The games to add to the history
   */
  public addGames(games: GameResult[] | Array<InstanceType<typeof Game>>) {
    // eslint-disable-next-line guard-for-in
    const type = this._initialGamesType(games);
    if (type === '') {
      return;
    }
    for (const game of games) {
      this.addGame(game);
    }
  }
}
