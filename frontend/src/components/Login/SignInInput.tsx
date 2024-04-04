import { Button, Heading, Input } from '@chakra-ui/react';
import {
  isSignInWithEmailLink,
  signInWithEmailAndPassword,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from '../../classes/users/firebaseconfig';
import React, { useState } from 'react';

export default function SignInInput() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  function attemptLogin() {
    setSigningIn(true);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // get the email if available (is on same device)
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        // user opened the link on a different device, get it now
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      // client SDK will parse the code from the link
      signInWithEmailLink(auth, email, window.location.href)
        .then(result => {
          // clear email from storage
          window.localStorage.removeItem('emailForSignIn');
          console.log(result);
          setIsSignedIn(true);
        })
        .catch(error => {
          console.log(error);
        });
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setIsSignedIn(true);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    setSigningIn(false);
  }

  // absolutely horrendous signin form - will polish once it has a more permanent home ie. not in the town selection screen
  return (
    <>
      {isSignedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <>
          <Heading>Sign In</Heading>
          <Input type='text' placeholder='email' onChange={event => setEmail(event.target.value)} />
          <Input
            type='password'
            placeholder='password'
            onChange={event => setPassword(event.target.value)}
          />
          <Button
            datatype-testid='signin-button'
            onClick={() => attemptLogin()}
            isLoading={signingIn}
            disabled={signingIn || isSignedIn}>
            Sign In
          </Button>
        </>
      )}
    </>
  );
}
