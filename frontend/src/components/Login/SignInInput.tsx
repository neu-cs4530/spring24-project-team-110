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
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          console.log(result);
          setIsSignedIn(true);
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
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
