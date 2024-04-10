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
import { auth } from '../../../../../../firebaseconfig';
import CreateAccount from '../../../../Login/CreateAccount';
import SignInInput from '../../../../Login/SignInInput';
import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import MyAccountInfo from '../../../../Login/MyAccountInfo';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { getAudioAndVideoTracks } = useVideoContext();
  const [displayName, setDisplayName] = useState<string | null>(null);

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
  
  onAuthStateChanged(auth, async fbuser => {
    if (fbuser) {
      // must update the display name here for it to refresh in child components
      if (!fbuser.displayName) {
        await updateProfile(fbuser, { displayName: displayName });
      }
      setUserInfo(fbuser);
    } else {
      setUserInfo(null);
    }
  });

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
        <CreateAccount updateDisplayName={setDisplayName}/>
        </>) : 
        <><DeviceSelectionScreen />
        <TownSelection /> 
        </>}
    </IntroContainer>
    <IntroContainer>
      <MyAccountInfo />
    </IntroContainer>
    </>
  );
}
