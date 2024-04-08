import GameResult from '../../classes/users/GameResult';
import React from 'react';
import { Stat, StatLabel, StatNumber, StatHelpText, StatGroup } from '@chakra-ui/react';
import { auth } from '../../classes/users/firebaseconfig';

export default function GameStats({ gameHistory }: { gameHistory: GameResult[] }) {
  const connectFourWins = gameHistory.filter(
    game => game.gameType === 'Connect Four' && game.winner === auth.currentUser?.uid,
  ).length;
  const connectFourLosses = gameHistory.filter(
    game =>
      game.gameType === 'Connect Four' && game.winner && game.winner !== auth.currentUser?.uid,
  ).length;
  const connectFourTies = gameHistory.filter(
    game => game.gameType === 'Connect Four' && !game.winner,
  ).length;
  const ticTacToeWins = gameHistory.filter(
    game => game.gameType === 'TicTacToe' && game.winner === auth.currentUser?.uid,
  ).length;
  const ticTacToeLosses = gameHistory.filter(
    game => game.gameType === 'TicTacToe' && game.winner && game.winner !== auth.currentUser?.uid,
  ).length;
  const ticTacToeTies = gameHistory.filter(
    game => game.gameType === 'TicTacToe' && !game.winner,
  ).length;
  return (
    <StatGroup>
      <Stat>
        <StatLabel>TicTacToe</StatLabel>
        <StatNumber>
          {ticTacToeWins} - {ticTacToeLosses} - {ticTacToeTies}
        </StatNumber>
        <StatHelpText>(W - L - T)</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>ConnectFour</StatLabel>
        <StatNumber>
          {connectFourWins} - {connectFourLosses} - {connectFourTies}
        </StatNumber>
        <StatHelpText>(W - L - T)</StatHelpText>
      </Stat>
    </StatGroup>
  );
}
