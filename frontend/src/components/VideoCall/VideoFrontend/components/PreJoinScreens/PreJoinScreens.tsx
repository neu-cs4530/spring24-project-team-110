import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Button, Heading, Text } from '@chakra-ui/react';
import TownSelection from '../../../../Login/TownSelection';
import { TownJoinResponse } from '../../../../../types/CoveyTownSocket';
import { auth, testFirebaseStuff } from '../../../../../classes/users/firebaseconfig';
import CreateAccount from '../../../../Login/CreateAccount';
import SignInInput from '../../../../Login/SignInInput';
import { User, onAuthStateChanged } from 'firebase/auth';
import MyAccountInfo from '../../../../Login/MyAccountInfo';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

// TODO: remove this eventually
testFirebaseStuff();

export default function PreJoinScreens() {
  const { user } = useAppState();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { getAudioAndVideoTracks } = useVideoContext();

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);
  
  onAuthStateChanged(auth, fbuser => {
    if (fbuser) {
      setUserInfo(fbuser);
    } else {
      setUserInfo(null);
    }
  });


  const attemptSignout = async () => {
    auth.signOut().then(() => {
      console.log('Signed out');
    });
  };

  return (
    <>
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      <Heading as="h2" size="xl">Welcome to Covey.Town!</Heading>
      <Text p="4">
        Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat.
        To get started, setup your camera and microphone, choose a username, and then create a new town
        to hang out in, or join an existing one.
      </Text>
      {userInfo === null ? 
        (<>
        <Text p="4">
          Please log in or register to continue
        </Text>
        <SignInInput />
        <CreateAccount />
        </>) : 
        <><DeviceSelectionScreen />
        <TownSelection /> 
        <Button
            datatype-testid='signout-button'
            onClick={attemptSignout}
            >
            Sign Out
          </Button>
        </>}
    </IntroContainer>
    {( userInfo?.emailVerified && 
    <IntroContainer>
      <MyAccountInfo />
    </IntroContainer>
    )}
    </>
  );
}
