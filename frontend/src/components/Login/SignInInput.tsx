import {
  isSignInWithEmailLink,
  signInWithEmailAndPassword,
  signInWithEmailLink,
} from 'firebase/auth';
import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { auth } from '../../classes/users/firebaseconfig';
import React, { useState } from 'react';

export default function SignInInput() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(auth.currentUser !== null);
  const [signingIn, setSigningIn] = useState(false);

  const attemptLogin = async () => {
    setSigningIn(true);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // get the email if available (is on same device)
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        // user opened the link on a different device, get it now
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      await signInWithEmailLink(auth, email, window.location.href)
        .then(result => {
          window.localStorage.removeItem('emailForSignIn');
          console.log(result);
          setIsSignedIn(true);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log(auth.currentUser?.email);
          console.log(auth.currentUser?.emailVerified);
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
    console.log(auth.currentUser?.emailVerified);
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
