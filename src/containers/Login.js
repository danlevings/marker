import React, { Component } from "react";
import firebase from "firebase";
import { Button } from "antd";

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
        <h1 className="stroked">Login to Marker</h1>
        <div
          style={{
            width: 300,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button onClick={this.onSignIn}>Sign in</Button>
        </div>
      </div>
    );
  }
}

export default Login;
