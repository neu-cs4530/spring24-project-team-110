import GameResult from '../../classes/users/GameResult';
import React from 'react';
import { Stat, StatLabel, StatNumber, StatHelpText, StatGroup } from '@chakra-ui/react';
import { auth } from '../../classes/users/firebaseconfig';

export default function GameStats({ gameHistory }: { gameHistory: GameResult[] }) {
  const connectFourWins = gameHistory.filter(
    game => game.gameType === 'ConnectFour' && game.gameWinner === auth.currentUser?.uid,
  ).length;
  const connectFourLosses = gameHistory.filter(
    game => game.gameType === 'ConnectFour' && game.gameWinner !== auth.currentUser?.uid,
  ).length;
  const ticTacToeWins = gameHistory.filter(
    game => game.gameType === 'TicTacToe' && game.gameWinner === auth.currentUser?.uid,
  ).length;
  const ticTacToeLosses = gameHistory.filter(
    game => game.gameType === 'TicTacToe' && game.gameWinner !== auth.currentUser?.uid,
  ).length;
  return (
    <StatGroup>
      <Stat>
        <StatLabel>TicTacToe</StatLabel>
        <StatNumber>
          {ticTacToeWins} - {ticTacToeLosses}
        </StatNumber>
        <StatHelpText>(W - L)</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>ConnectFour</StatLabel>
        <StatNumber>
          {connectFourWins} - {connectFourLosses}
        </StatNumber>
        <StatHelpText>(W - L)</StatHelpText>
      </Stat>
    </StatGroup>
  );
}
