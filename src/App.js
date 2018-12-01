import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "antd/dist/antd.css";
import firebase from "firebase";

import Answer from "./containers/Answer";
import Answers from "./containers/Answers";
import Ask from "./containers/Ask";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Questions from "./containers/Questions";
import Review from "./containers/Review";

class App extends Component {
  state = {
    isLoading: false,
    isAuthenticated: true
  };

  componentDidMount() {
    var user = firebase.auth().currentUser;
    console.log(user);
    this.setState({
      isLoading: false,
      isAuthenticated: user
    });

    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        isLoading: false,
        isAuthenticated: user
      });
    });
  }

  onLogout = () => {
    firebase.auth().signOut();
  };
  render() {
    const { isLoading, isAuthenticated } = this.state;
    console.log(isAuthenticated);
    if (isLoading) {
      return "Loading...";
    }
    if (!isAuthenticated) {
      return (
        <div className="App">
          <Login />
        </div>
      );
    }
    return (
      <Router>
        <div className="App">
          {isAuthenticated && (
            <div className="auth" onClick={this.onLogout}>
              Logged in as {isAuthenticated.displayName} (Log out)
            </div>
          )}
          <div className="wrapper">
            <Route exact path="/" component={Home} />
            <Route exact path="/ask" component={Ask} />
            <Route exact path="/answer/:questionId" component={Answer} />
            <Route exact path="/answers" component={Answers} />
            <Route exact path="/questions" component={Questions} />
            <Route exact path="/review/:answerId" component={Review} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
