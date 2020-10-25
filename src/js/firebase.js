import Refs from './refs';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';



const app = firebase.initializeApp({
    apiKey: "AIzaSyBMhO0NQUdNhSwM2MzfffK0CnXNvO-SQ5Q",
    authDomain: "snake-e2214.firebaseapp.com",
    databaseURL: "https://snake-e2214.firebaseio.com",
    projectId: "snake-e2214",
    storageBucket: "snake-e2214.appspot.com",
    messagingSenderId: "1059522027824",
    appId: "1:1059522027824:web:73740d4b7a4ff4094228f5"
  });

firebase.auth().onAuthStateChanged(fbUser => {
  if (fbUser) {
    console.log(fbUser);
    Refs.logout.style.display = 'inline';
    Refs.login.style.display = 'none';
    Refs.singup.style.display = 'none';
    Refs.email.style.display = 'none';
    Refs.password.style.display = 'none';
  } else {
    console.log("User not logged in");
    Refs.logout.style.display = 'none';
    Refs.login.style.display = 'inline';
    Refs.singup.style.display = 'inline';
    Refs.email.style.display = 'inline-block';
    Refs.password.style.display = 'inline-block';
  }
});



Refs.login.addEventListener('click', authorization);
Refs.logout.addEventListener('click', logOut);
Refs.singup.addEventListener('click', singUp);

function authorization(e) { 
  e.preventDefault();
  const auth = firebase.auth();
  const promise = auth.signInWithEmailAndPassword(Refs.email.value, Refs.password.value);
  promise.catch(e => console.error(e.message));
}

function logOut(e) { 
  e.preventDefault();
  firebase.auth().signOut();
}

function singUp(e) { 
  e.preventDefault();
  const auth = firebase.auth();
  const promise = auth.createUserWithEmailAndPassword(Refs.email.value, Refs.password.value);
  promise.then(user => addUserToDB(user)).catch(e => console.error(e.message));
}

function addUserToDB({ user }) {
  const { uid, email } = user;
  const db = firebase.database();
  const users = db.ref('users');
  const stats = db.ref('stats');
  users.child(uid).set({ 'email': email }).then(console.log('user added to DB')).catch(e => console.error(e.message));
  stats.child(uid).set({ 'total': 0, 'maxScore': 0 }).catch(e => console.error(e.message));
}