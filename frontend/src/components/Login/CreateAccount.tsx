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

  async function createAcc() {
    setIsCreating(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        await updateProfile(user, { displayName: displayName });
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
          .then(() => {
            // save the email locally so we don't need to ask for it again
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
  }

  return (
    <form>
      <Box mb='2' p='4' borderWidth='1px' borderRadius='lg'>
        {(!loggedInUser && (
          <>
            <Heading>Create Account</Heading>
            <FormControl>
              <FormLabel htmlFor='displayName'>Display Name</FormLabel>
              <Input
                autoFocus
                type='email'
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
              Create Account
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
    </form>
  );
}
