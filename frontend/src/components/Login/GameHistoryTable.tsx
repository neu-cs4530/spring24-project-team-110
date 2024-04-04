import React from 'react';
import GameResult from '../../classes/users/GameResult';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption } from '@chakra-ui/react';
import { auth } from '../../classes/users/firebaseconfig';

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
            <Td textColor={gameResult.winner === auth.currentUser?.uid ? 'green' : 'red'}>
              {gameResult.winner === auth.currentUser?.uid ? 'Win' : 'Lose'}
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
