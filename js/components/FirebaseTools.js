import firebase from 'firebase';
import {
  FIREBASE_API_KEY,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET
} from 'react-native-dotenv';

import strings from '../../i18n/strings';

export const initializeDatabase = () => 
  firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    emailInputErrorMessage: strings.emailInputErrorMessage
  });

export const logOutOfDatabase = fireBaseApp =>
  fireBaseApp
    .auth()
    .signOut()
    .then(() => {
      console.log('Logged out');
    })
    .catch(error => console.log('An error occurred while logging out:', error));

export const getItemsRef = firebaseApp => firebaseApp.database().ref().child('branches');