import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// var firebaseConfig = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     appId: "",
//   };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  export const db = firebaseApp.firestore()
  export const auth = firebase.auth()

 