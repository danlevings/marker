import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "antd/dist/antd.css";
import firebase from "firebase";

import Answer from "./containers/Answer";
import Answers from "./containers/Answers";
import Ask from "./containers/Ask";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Questions from "./containers/Questions";
import Review from "./containers/Review";
import Register from "./containers/Register";

class App extends Component {
  state = {
    isLoading: false,
    isAuthenticated: true
  };

  componentDidMount() {
    var user = firebase.auth().currentUser;
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
    firebase
      .auth()
      .signOut()
      .then(() => (window.location.href = ""));
  };
  render() {
    const { isLoading, isAuthenticated } = this.state;

    if (isLoading) {
      return "Loading...";
    }
    if (!isAuthenticated) {
      return (
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact component={Login} />
            </Switch>
          </div>
        </Router>
      );
    }
    return (
      <Router>
        <div className="App">
          {isAuthenticated && (
            <div className="auth" onClick={this.onLogout}>
              Logged in as{" "}
              {isAuthenticated.displayName || isAuthenticated.email} (Log out)
            </div>
          )}
          <Route exact path="/" component={Home} />
          <Route exact path="/ask" component={Ask} />
          <Route exact path="/answer/:questionId" component={Answer} />
          <Route exact path="/answers" component={Answers} />
          <Route exact path="/questions" component={Questions} />
          <Route exact path="/review/:answerId" component={Review} />
        </div>
      </Router>
    );
  }
}

export default App;
