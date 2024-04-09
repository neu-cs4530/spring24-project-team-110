import { Box, Button, Heading, Input, useToast, HStack } from '@chakra-ui/react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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
      .then(() => {
        setIsSignedIn(true);
      })
      .catch(error => {
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

  const attempSendPasswordReset = async () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast({
          title: 'Password reset email sent',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error: Error) => {
        const errorMessage = error.message.includes('missing-email')
          ? 'Please fill in your email for a password reset email to be sent.'
          : signingErrorToString(error);
        toast({
          title: 'Error sending password reset email',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
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
            <HStack spacing={4}>
              <Button
                datatype-testid='signin-button'
                onClick={attemptLogin}
                isLoading={signingIn}
                disabled={signingIn || isSignedIn}>
                Sign In
              </Button>
              <Button datatype-testid='pass-reset-button' onClick={attempSendPasswordReset}>
                Forgot Password?
              </Button>
            </HStack>
          </Box>
        </>
      )}
    </>
  );
}
