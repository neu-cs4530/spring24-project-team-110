import { Button, Heading, Avatar, HStack, Text, Divider } from '@chakra-ui/react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../../classes/users/firebaseconfig';
import React, { useState, useEffect } from 'react';
import GameResult from '../../classes/users/GameResult';
import getGameHistory from '../../classes/users/gameHistoryService';
import GameHistoryTable from './GameHistoryTable';
import GameStats from './GameStats';

export default function MyAccountInfo() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);

  const getHistory = async (userId: string) => {
    setGameHistory(await getGameHistory(userId));
  };

  useEffect(() => {
    if (isSignedIn && userInfo) {
      getHistory(userInfo.uid);
    }
  }, [isSignedIn, userInfo]);

  onAuthStateChanged(auth, user => {
    if (user) {
      setIsSignedIn(true);
      setUserInfo(user);
    } else {
      setIsSignedIn(false);
    }
  });

  return (
    <>
      <Heading size={'md'}>My Account Information</Heading>
      <br />
      {isSignedIn && userInfo && auth.currentUser !== null ? (
        <>
          <HStack>
            <Avatar name={userInfo.displayName || ''} />
            <Text fontSize='3xl'>{userInfo.displayName}</Text>
          </HStack>
          <br />
          <Text fontSize='sm'>Email: {userInfo.email}</Text>
          <br />
          <Divider borderWidth='2px' />
          <br />
          <GameStats gameHistory={gameHistory} />
          <br />
          <Divider borderWidth='2px' />
          <br />
          <GameHistoryTable gameHistory={gameHistory} />
          <Button
            datatype-testid='signin-button'
            onClick={() => signOut(auth)}
            isLoading={false}
            disabled={false}>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Text>Sign in to see account information</Text>
        </>
      )}
    </>
  );
}
