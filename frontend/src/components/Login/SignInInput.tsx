import { Box, Button, Heading, Input, useToast } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../classes/users/firebaseconfig';
import React, { useState } from 'react';

export default function SignInInput() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(auth.currentUser !== null);
  const [signingIn, setSigningIn] = useState(false);
  const toast = useToast();

  function signingErrorToString(error: Error) {
    const firebaseLength = 'Firebase: '.length;
    if (error.message.startsWith('Firebase: Error (auth/invalid-email)')) {
      return 'Email address is not valid. Please try again.';
    } else if (error.message.startsWith('Firebase: Error (auth/invalid-credential)')) {
      return 'Invalid email or password. Please try again.';
    } else if (error.message.startsWith('Firebase: Error (auth/missing-password)')) {
      return 'Password is required. Please try again.';
    } else {
      return error.message.substring(firebaseLength, error.message.length - 1);
    }
  }

  const attemptLogin = async () => {
    setSigningIn(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setIsSignedIn(true);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast({
          title: 'Error signing in',
          description: signingErrorToString(error),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
    setSigningIn(false);
  };

  return (
    <>
      {isSignedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <>
          <Box p='4' borderWidth='1px' borderRadius='lg'>
            <Heading>Sign In</Heading>
            <Input
              type='text'
              placeholder='email'
              onChange={event => setEmail(event.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              onChange={event => setPassword(event.target.value)}
            />
            <Button
              datatype-testid='signin-button'
              onClick={attemptLogin}
              isLoading={signingIn}
              disabled={signingIn || isSignedIn}>
              Sign In
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
