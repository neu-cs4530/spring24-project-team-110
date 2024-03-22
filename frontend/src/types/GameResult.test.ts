import GameResult from './GameResult';

/**
 * Tests for the GameResult class
 */
describe('GameResult', () => {
  it('should create a new GameResult', () => {
    const date = new Date();
    const gameResult = new GameResult('TicTacToe', date, ['player1', 'player2'], 'player1');
    expect(gameResult.gameType).toEqual('TicTacToe');
    expect(gameResult.gameDate).toEqual(date);
    expect(gameResult.gamePlayers).toEqual(['player1', 'player2']);
    expect(gameResult.gameWinner).toEqual('player1');
  });
});
