import React, { Component } from "react";
import firebase from "firebase";
import GoogleSignInImage from "../assets/btn_google_signin.png";
import styled from "styled-components";
import { notification } from "antd";
import { Link } from "react-router-dom";

const SignInButton = styled.button`
  background: none;
  outline: none;
  border: none;
  text-align: center;
  cursor: pointer;
`;

const TextBox = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border: 1px solid black;
  margin-bottom: 16px;
  font-size: 18px;
  padding: 4px 8px;

  &:focus {
    background: white;
  }
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

  onGoogleSignIn = () => {
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
        console.error("CAUGHT", error);
      });
  };

  onSignIn = e => {
    if (e) {
      e.preventDefault();
    }
    if (!this.emailRef) {
      return;
    }

    const email = this.emailRef.value;
    const password = this.passwordRef.value;

    if (!email || !password) {
      notification.error({ message: "Please input both email and password" });
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        notification.success({ message: `Welcome, ${email}` });
      })
      .catch(error => {
        notification.error({ message: error.message });
      });
  };

  render() {
    return (
      <form
        className="wrapper"
        onSubmit={this.onSignIn}
        style={{ textAlign: "center" }}
      >
        <h1 className="stroked">Welcome to Marker</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          <TextBox
            type="text"
            placeholder="Email"
            ref={ref => (this.emailRef = ref)}
          />
          <TextBox
            type="password"
            placeholder="Password"
            ref={ref => (this.passwordRef = ref)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/register" className="button">
            Register
          </Link>
          <button type="submit" className="button" onClick={this.onSignIn}>
            Log in
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 60
          }}
        >
          <SignInButton onClick={this.onGoogleSignIn}>
            <img src={GoogleSignInImage} alt="Sign in" />
          </SignInButton>
        </div>
        <footer>A university project by Dan Levings</footer>
      </form>
    );
  }
}

export default Login;
