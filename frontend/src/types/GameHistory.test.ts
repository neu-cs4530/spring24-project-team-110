import GameHistory from './GameHistory';
import TicTacToeGame from '../../../townService/src/town/games/TicTacToeGame';
import ConnectFourGame from '../../../townService/src/town/games/ConnectFourGame';
import GameResult from '../../../townService/src/town/games/GameResult';
import Game from '../../../townService/src/town/games/Game';

class Helper {
  static gameToGameResult(game: InstanceType<typeof Game>): GameResult {
    return new GameResult(game.id, game.date, game.players, game.winner);
  }
}

describe('GameHistory', () => {
  it('should create a new GameHistory with no games', () => {
    const gameHistory = new GameHistory();
    expect(gameHistory.games).toEqual([]);
  });

  it('should create a new GameHistory with an initial set of games', () => {
    const game1 = new TicTacToeGame();
    const game2 = new ConnectFourGame();
    const gameHistory = new GameHistory([game1, game2]);
    expect(gameHistory.games).toEqual([
      Helper.gameToGameResult(game1),
      Helper.gameToGameResult(game2),
    ]);
  });

  it('should create a new GameHistory with an initial set of game results', () => {
    const game1 = new TicTacToeGame();
    const game2 = new ConnectFourGame();
    const gameResult1 = new GameResult(game1.id, game1.date, game1.players, game1.winner);
    const gameResult2 = new GameResult(game2.id, game2.date, game2.players, game2.winner);
    const gameHistory = new GameHistory([gameResult1, gameResult2]);
    expect(gameHistory.games).toEqual([gameResult1, gameResult2]);
  });

  it('should add a game to the game history', () => {
    const gameHistory = new GameHistory();
    const game = new TicTacToeGame();
    gameHistory.addGame(game);
    expect(gameHistory.games).toEqual([Helper.gameToGameResult(game)]);
  });

  it('should return a copy of the games array', () => {
    const gameHistory = new GameHistory();
    const game = new TicTacToeGame();
    gameHistory.addGame(game);
    const { games } = gameHistory;
    games[0] = new GameResult('', new Date(), [], '');
    expect(gameHistory.games).toEqual([Helper.gameToGameResult(game)]);
  });

  it('should add multiple games to the game history', () => {
    const gameHistory = new GameHistory();
    const game1 = new TicTacToeGame();
    const game2 = new ConnectFourGame();
    gameHistory.addGames([game1, game2]);
    expect(gameHistory.games).toEqual([
      Helper.gameToGameResult(game1),
      Helper.gameToGameResult(game2),
    ]);
  });

  it('should add multiple game results to the game history', () => {
    const gameHistory = new GameHistory();
    const game1 = new TicTacToeGame();
    const game2 = new ConnectFourGame();
    const gameResult1 = new GameResult(game1.id, game1.date, game1.players, game1.winner);
    const gameResult2 = new GameResult(game2.id, game2.date, game2.players, game2.winner);
    gameHistory.addGames([gameResult1, gameResult2]);
    expect(gameHistory.games).toEqual([gameResult1, gameResult2]);
  });
});
