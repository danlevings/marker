import firebase from "firebase";

export default () => {
  const config = {
    apiKey: "AIzaSyDhGhP34vLDp2Xv1cIYxJN0fMl3vopRR6o",
    authDomain: "marker-6d055.firebaseapp.com",
    databaseURL: "https://marker-6d055.firebaseio.com",
    projectId: "marker-6d055"
  };
  firebase.initializeApp(config);
};
