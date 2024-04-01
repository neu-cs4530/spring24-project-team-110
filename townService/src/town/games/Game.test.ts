import TicTacToeGame from './TicTacToeGame';
import { createPlayerForTesting } from '../../TestUtils';
import ConnectFourGame from './ConnectFourGame';

describe('Game', () => {
  it('should write to Firestore with never-seen-before players', async () => {
    const game = new TicTacToeGame();
    const p1 = createPlayerForTesting();
    const p2 = createPlayerForTesting();

    game.join(p1);
    game.join(p2);

    const result = await game.writeGameResults('test_collection');

    expect(result).toEqual(0);
  });

  it('should write to Firestore with previously-seen players', async () => {
    const game1 = new TicTacToeGame();
    const p1 = createPlayerForTesting('a');
    const p2 = createPlayerForTesting('b');

    game1.join(p1);
    game1.join(p2);

    await game1.writeGameResults('test_collection');

    const game2 = new TicTacToeGame();

    game2.join(p1);
    game2.join(p2);

    await game2.writeGameResults('test_collection');
    const result = await game2.writeGameResults('test_collection');

    expect(result).toEqual(0);
  });

  it('should fail to write to Firestore', async () => {
    const game = new ConnectFourGame();
    const p1 = createPlayerForTesting();
    const p2 = createPlayerForTesting();

    game.join(p1);
    game.join(p2);

    const result = await game.writeGameResults('fake_collection');

    expect(result).toEqual(1);
  });
});
