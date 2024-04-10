import { Button, Heading, Avatar, HStack, Text, Divider } from '@chakra-ui/react';
import { onAuthStateChanged, User, signOut, onIdTokenChanged } from 'firebase/auth';
import { auth } from '../../../firebaseconfig';
import React, { useState, useEffect, useMemo } from 'react';
import GameResult from '../../classes/users/GameResult';
import getGameHistory from '../../classes/users/gameHistoryService';
import GameHistoryTable from './GameHistoryTable';
import GameStats from './GameStats';

export default function MyAccountInfo() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [displayName, setDisplayName] = useState<string>('');

  const getHistory = async (userId: string) => {
    setGameHistory(await getGameHistory(userId));
  };

  useEffect(() => {
    if (userInfo) {
      getHistory(userInfo.uid);
    }
  }, [userInfo]);

  async function getDispName() {
    return auth.currentUser?.displayName || auth.currentUser?.email || '';
  }

  onAuthStateChanged(auth, user => {
    if (user) {
      setIsSignedIn(true);
      setUserInfo(user);
      setDisplayName(user.displayName || user.email || '');
    } else {
      setIsSignedIn(false);
    }
  });

  // fetches the user's display name here for it to be accurate on render
  useMemo(() => {
    auth.currentUser?.reload();
    onIdTokenChanged(auth, async fbuser => {
      if (fbuser) {
        setDisplayName(await getDispName());
      } else {
        setDisplayName('');
      }
    });
  }, []);

  return (
    <>
      <Heading size={'md'}>My Account Information</Heading>
      <br />
      {isSignedIn && userInfo && auth.currentUser !== null ? (
        <>
          <HStack>
            <Avatar name={displayName} />
            <Text fontSize='3xl'>{displayName}</Text>
          </HStack>
          <br />
          <Text fontSize='sm'>Email: {userInfo.email}</Text>
          <br />
          <Divider borderWidth='2px' />
          <br />
          {gameHistory && (
            <>
              <GameStats gameHistory={gameHistory} />
              <br />
              <Divider borderWidth='2px' />
              <br />
              <GameHistoryTable gameHistory={gameHistory} />
            </>
          )}
          {!gameHistory && (
            <>
              <Text>No game history yet.</Text>
              <br />
            </>
          )}
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
