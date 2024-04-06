import GameResult from './GameResult';
import { Timestamp } from 'firebase/firestore';

/**
 * Tests for the GameResult class
 */
describe('GameResult', () => {
  it('should create a new GameResult', () => {
    const date = new Timestamp(10, 20);
    const gameResult = new GameResult('TicTacToe', date, ['player1', 'player2'], 'player1');
    expect(gameResult.gameType).toEqual('TicTacToe');
    expect(gameResult.date).toEqual(date);
    expect(gameResult.players).toEqual(['player1', 'player2']);
    expect(gameResult.winner).toEqual('player1');
  });
});
