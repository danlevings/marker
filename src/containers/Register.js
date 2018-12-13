import React, { Component } from "react";
import { notification } from "antd";
import firebase from "firebase";
import styled from "styled-components";
import BackButton from "../components/BackButton";

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

  onRegister = e => {
    if (e) {
      e.preventDefault();
    }
    if (!this.emailRef || !this.passwordRef || !this.password2Ref) {
      notification.error({ message: "Please fill out all fields" });
      return;
    }

    const email = this.emailRef.value;
    const password = this.passwordRef.value;
    const password2 = this.password2Ref.value;

    if (password !== password2) {
      notification.error({ message: "Your passwords did not match" });
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        notification.success({ message: "Account created - logging in" });
        this.props.history.push("/");
      })
      .catch(error => {
        notification.error({ message: error.message });
      });
  };

  render() {
    return (
      <div className="wrapper" style={{ textAlign: "center" }}>
        <h1 className="stroked">Marker</h1>
        <form
          onSubmit={this.onRegister}
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
          <TextBox
            type="password"
            placeholder="Repeat password"
            ref={ref => (this.password2Ref = ref)}
          />
          <button type="submit" className="button" onClick={this.onRegister}>
            Register
          </button>

          <BackButton to="/">Back to login</BackButton>
        </form>
        <footer>A university project by Dan Levings</footer>
      </div>
    );
  }
}

export default Login;
