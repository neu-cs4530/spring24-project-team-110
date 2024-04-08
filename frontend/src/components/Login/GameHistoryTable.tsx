import React from 'react';
import GameResult from '../../classes/users/GameResult';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption } from '@chakra-ui/react';
import { auth } from '../../classes/users/firebaseconfig';

const getResultColor = (winner: string) => {
  if (winner === auth.currentUser?.uid) {
    // win
    return 'green';
  }
  if (!winner) {
    // tie
    return '#b89707';
  }
  // loss
  return 'red';
};

const getResultText = (winner: string) => {
  if (winner === auth.currentUser?.uid) {
    return 'Win';
  }
  if (!winner) {
    return 'Tie';
  }
  return 'Lose';
};

export default function GameHistoryTable({ gameHistory }: { gameHistory: GameResult[] }) {
  return (
    <Table variant='simple'>
      <TableCaption>Game History</TableCaption>
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Type</Th>
          <Th>Result</Th>
          <Th>Opponent</Th>
        </Tr>
      </Thead>
      <Tbody>
        {gameHistory.map((gameResult, index) => (
          <Tr key={index}>
            <Td>{gameResult.date.toDate().toDateString()}</Td>
            <Td>{gameResult.gameType}</Td>
            <Td textColor={getResultColor(gameResult.winner)}>
              {getResultText(gameResult.winner)}
            </Td>
            <Td>
              {gameResult.players.find(userName => userName !== auth.currentUser?.displayName)}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
