import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDp3C05RlkH7pIu31fzskVFv16MHGhwRSY",
    authDomain: "remo-coding-challenge-67c5a.firebaseapp.com",
    databaseURL: "https://remo-coding-challenge-67c5a.firebaseio.com",
    projectId: "remo-coding-challenge-67c5a",
    storageBucket: "remo-coding-challenge-67c5a.appspot.com",
    messagingSenderId: "745696303122",
    appId: "1:745696303122:web:fc029e1d6465f827d120cb"    
};

firebase.initializeApp(firebaseConfig);

export default firebase;