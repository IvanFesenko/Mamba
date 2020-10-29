import Refs from './refs';
import { setStatsHTML } from './stats';
import { getGameMode } from './snake/modes';
import { onCloseModal } from './auth-modal';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

Refs.login.addEventListener('click', authorization);
Refs.logout.addEventListener('click', logOut);
Refs.singup.addEventListener('click', singUp);

firebase.initializeApp({
  apiKey: 'AIzaSyBMhO0NQUdNhSwM2MzfffK0CnXNvO-SQ5Q',
  authDomain: 'snake-e2214.firebaseapp.com',
  databaseURL: 'https://snake-e2214.firebaseio.com',
  projectId: 'snake-e2214',
  storageBucket: 'snake-e2214.appspot.com',
  messagingSenderId: '1059522027824',
  appId: '1:1059522027824:web:73740d4b7a4ff4094228f5',
});

// будет переписана после подключения модальной страницы авторизации
firebase.auth().onAuthStateChanged(fbUser => {
  if (fbUser) {

    hideElement(Refs.registration);
    showElement(Refs.logoutWrap);      
  } else {    
    hideElement(Refs.logoutWrap); 

  }
});

async function authorization(e) {
  e.preventDefault();
  try {
    const auth = firebase.auth();
    await auth.signInWithEmailAndPassword(
      Refs.email.value,
      Refs.password.value,
    );

    onCloseModal();    
    hideElement(Refs.registration);

    await getUserStats();
  } catch {
    alert('Failed to login');
  }
}

function logOut(e) {
  e.preventDefault();

  firebase.auth().signOut();  
  showElement(Refs.registration);

}

async function singUp(e) {
  e.preventDefault();
  try {
    const userName = Refs.userName.value;
    const nameAvailable = await userNameAvailable(userName);
    if (nameAvailable) {
      const auth = firebase.auth();
      const user = await auth.createUserWithEmailAndPassword(
        Refs.email.value,
        Refs.password.value,
      );

      await addUserToDB(user, userName);      
      hideElement(Refs.registration);

      onCloseModal();
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
    users.child(uid).set({ email: email, userName: userName });
    stats.child(`${uid}/classic`).set({ total: 0, maxScore: 0 });
    stats.child(`${uid}/arcade`).set({ total: 0, maxScore: 0 });
    stats.child(`${uid}/total`).set(0);
  } catch {
    console.error('user add failed');
  }
}

export function userLoggedIn() {
  return firebase.auth().currentUser ? true : false;
}

function getCurrentUserID() {
  return firebase.auth().currentUser.uid;
}

async function getUserName() {
  const userID = getCurrentUserID();
  const db = firebase.database();
  const user = db.ref(`/users/${userID}/userName`);
  const dataSnapshot = await user.once('value');
  return dataSnapshot.val();
}

async function userNameAvailable(userName) {
  try {
    const db = firebase.database();
    const users = db.ref('userNames');
    const dataSnapshot = await users.once('value');
    const data = dataSnapshot.val();
    const usedNames = Object.values(data);
    return !usedNames.includes(userName);
  } catch {
    console.error('Cannot read data from DB!');
  }
}

export async function getUserStats() {
  const userID = getCurrentUserID();
  const db = firebase.database();
  const userStats = db.ref(`/stats/${userID}`);
  const dataSnapshot = await userStats.once('value');
  return dataSnapshot.val();
}

export async function updateUserStats(newScore) {
  const userID = getCurrentUserID();
  const stats = await getUserStats();
  const mode = getGameMode();
  stats.total += 1;

  if (mode === 'classic') {
    if (stats.classic.maxScore < newScore) {
      stats.classic.maxScore = newScore;
      stats.classic.total += 1;
    }
  }
  if (mode === 'arcade') {
    if (stats.arcade.maxScore < newScore) {
      stats.arcade.maxScore = newScore;
      stats.arcade.total += 1;
    }
  }
  const db = firebase.database();
  const Stats = db.ref(`/stats/${userID}`);
  Stats.set(stats);
}

async function updateTopStats(newStats, mode) {
  const db = firebase.database();
  const stats = db.ref(`/TOP10/${mode}`);
  const sortedStats = getSortedTopList(newStats);
  const uniqStats = getUniStatsList(sortedStats);
  stats.set(uniqStats);
}

export async function getTopStats(mode) {
  const db = firebase.database();
  const topStats = db.ref(`/TOP10/${mode}`);
  const dataSnapshot = await topStats.once('value');
  return dataSnapshot.val();
}

export async function userGetTop(score) {
  const mode = getGameMode();
  const topStats = await getTopStats(mode);
  const minScore = topStats[topStats.length - 1];
  if (topStats.length < 10 || score > minScore.score) {
    const name = await getUserName();
    if (topStats.length < 10) {
      topStats[topStats.length] = { name, score };
    } else {
      topStats[topStats.length - 1] = { name, score };
    }
    await updateTopStats(topStats, mode);
    setStatsHTML();
    return true;
  }
  return false;
}

function getUniStatsList(list) {
  const uniqStats = [];
  const map = new Map();
  for (const item of list) {
    if (!map.has(item.name)) {
      map.set(item.name, true);
      uniqStats.push({
        name: item.name,
        score: item.score,
      });
    }
  }
  return uniqStats;
}

function getSortedTopList(list) {
  return [...list].sort((firstEl, secondEl) => secondEl.score - firstEl.score);
}

