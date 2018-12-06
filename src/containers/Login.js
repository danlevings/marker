import React, { Component } from "react";
import firebase from "firebase";
import GoogleSignInImage from "../assets/btn_google_signin.png";
import styled from "styled-components";

const SignInButton = styled.button`
  background: none;
  outline: none;
  border: none;
  text-align: center;
`;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  provider = null;

  componentDidMount() {
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  onSignIn = () => {
    if (!this.provider) {
      return;
    }

    firebase
      .auth()
      .signInWithPopup(this.provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        localStorage.setItem("G_TOKEN", token);
        localStorage.setItem("G_USER", JSON.stringify(user));
        // ...
      })
      .catch(error => {
        console.log(error);
      });
  };
  render() {
    return (
      <div className="wrapper" style={{ textAlign: "center" }}>
        <h1 className="stroked">Marker</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <SignInButton onClick={this.onSignIn}>
            <img src={GoogleSignInImage} alt="Sign in" />
          </SignInButton>
        </div>
        <footer>A university project by Dan Levings</footer>
      </div>
    );
  }
}

export default Login;
