import {
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Box,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  User,
  updateProfile,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import { auth } from '../../classes/users/firebaseconfig';

export default function CreateAccount() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined);
  const toast = useToast();

  function extractErrorMsg(error: Error) {
    const firebaseLength = 'Firebase: '.length;
    return error.message.substring(firebaseLength, error.message.length - 1);
  }

  const actionCodeSettings = {
    // this is only for testing, ideally we'll want to go to the landing page
    url: 'http://localhost:3000/', // https://persistentown.onrender.com/
    handleCodeInApp: true,
  };

  function verifyUserEmail() {
    setIsCreating(true);
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // Save the email locally so you don't need to ask the user for it again
        window.localStorage.setItem('emailForSignIn', email);
        toast({
          title: 'Email link sent',
          description: 'Check your email for a sign-in link.',
          status: 'success',
          duration: 9000,
          isClosable: false,
        });
      })
      .catch(error => {
        toast({
          title: 'Error sending link to email',
          description: extractErrorMsg(error),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
    setIsCreating(false);
  }

  async function createAcc() {
    setIsCreating(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // we should redirect them/rerender to somewhere useful (like the join town page) once we have that
        const user = userCredential.user;
        updateProfile(user, { displayName: displayName });
        setLoggedInUser(user);
        verifyUserEmail();
        console.log(user);
      })
      .catch((error: Error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast({
          title: 'Error creating account',
          description: extractErrorMsg(error),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });

    setIsCreating(false);
  }

  return (
    <Box mb='2' p='4' borderWidth='1px' borderRadius='lg'>
      {(!loggedInUser && (
        <>
          <Heading>Create Account</Heading>
          <FormControl>
            <FormLabel htmlFor='displayName'>Display Name</FormLabel>
            <Input
              autoFocus
              name='displayName'
              placeholder='Display name'
              value={displayName}
              onChange={event => setDisplayName(event.target.value)}
            />
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input
              autoFocus
              name='email'
              placeholder='Your email'
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input
              autoFocus
              name='password'
              placeholder='Password'
              value={password}
              type='password'
              onChange={event => setPassword(event.target.value)}
            />
          </FormControl>
          <Button
            data-testid='joinTownByIDButton'
            onClick={() => createAcc()}
            isLoading={isCreating}
            disabled={isCreating}>
            Connect
          </Button>
        </>
      )) || (
        <Box p='4' borderWidth='1px' borderRadius='lg'>
          <Text>
            Logged in with email {loggedInUser?.email} UID: {loggedInUser?.uid}
          </Text>
        </Box>
      )}
    </Box>
  );
}
