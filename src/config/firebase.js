import firebase from "firebase";
import APIKEY from "./APIKEY";
export default () => {
  const config = {
    apiKey: APIKEY,
    authDomain: "marker-6d055.firebaseapp.com",
    databaseURL: "https://marker-6d055.firebaseio.com",
    projectId: "marker-6d055"
  };
  firebase.initializeApp(config);
};
