import Refs from './refs';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


Refs.login.addEventListener('click', authorization);
Refs.logout.addEventListener('click', logOut);
Refs.singup.addEventListener('click', singUp);


firebase.initializeApp({
    apiKey: "AIzaSyBMhO0NQUdNhSwM2MzfffK0CnXNvO-SQ5Q",
    authDomain: "snake-e2214.firebaseapp.com",
    databaseURL: "https://snake-e2214.firebaseio.com",
    projectId: "snake-e2214",
    storageBucket: "snake-e2214.appspot.com",
    messagingSenderId: "1059522027824",
    appId: "1:1059522027824:web:73740d4b7a4ff4094228f5"
  });

// будет переписана после подключения модальной страницы авторизации
firebase.auth().onAuthStateChanged(fbUser => {
  if (fbUser) {
    console.log(fbUser);
    Refs.logout.style.display = 'inline';
    Refs.login.style.display = 'none';
    Refs.userName.style.display = 'none';    
    Refs.singup.style.display = 'none';
    Refs.email.style.display = 'none';
    Refs.password.style.display = 'none';
  } else {
    Refs.logout.style.display = 'none';
    Refs.login.style.display = 'inline';
    Refs.singup.style.display = 'inline';
    Refs.email.style.display = 'inline-block';
    Refs.password.style.display = 'inline-block';
    Refs.userName.style.display = 'inline-block';  
  }
});


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


async function singUp(e) { 
  e.preventDefault();
  try {
    const userName = Refs.userName.value;
    const nameAvailable = await userNameAvailable(userName);
    if (nameAvailable) {
      const auth = firebase.auth();
      const user = await auth.createUserWithEmailAndPassword(Refs.email.value, Refs.password.value);
      await addUserToDB(user, userName);
    } else {
      alert('Username already exists');
    }

  } catch {
    alert('User with this e-mail already exists');
  }  
}


async function addUserToDB({ user }, userName) {
  try { 
    const { uid, email } = user;
    const db = firebase.database();
    const users = db.ref('users');
    const stats = db.ref('stats');
    const userNames = db.ref('userNames');
    userNames.push(userName);  
    users.child(uid).set({ 'email': email, 'userName': userName});
    stats.child(uid).set({ 'total': 0, 'maxScore': 0 });
  } catch {
    console.error('user add failed');
  }
}


function getCurrentUserID() {
  return firebase.auth().currentUser.uid;
}


async function userNameAvailable(userName) {
  try {
    const db = firebase.database();
    const users = db.ref('userNames');
    const dataSnapshot = await users.once('value');
    const data = dataSnapshot.val();
    const usedNames = Object.values(data);
    return !usedNames.includes(userName)
  } catch {
    console.error('Cannot read data from DB!');
  }
}