import React, { Component } from "react";
import { Button, notification } from "antd";
import firebase from "firebase";

class Ask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleValue: "",
      keywordValue: ""
    };
  }

  onSubmit = () => {
    const { titleValue, keywordValue, question } = this.state;
    const { currentUser } = firebase.auth();
    firebase
      .firestore()
      .collection("questions")
      .doc()
      .set({
        author: {
          name: currentUser.displayName,
          uid: currentUser.uid
        },
        title: titleValue,
        keywords: keywordValue
      })
      .then(() => {
        this.props.history.push("/answers");
        notification.success({ message: "You created a question!" });
      });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { titleValue, keywordValue } = this.state;
    return (
      <div>
        <h1 className="stroked">Create a question</h1>
        <div>
          <div>What is the question?</div>
          <input
            type="text"
            value={titleValue}
            name="titleValue"
            onChange={this.onChange}
          />
        </div>
        <div>
          <div>What could a possible answer look like?</div>
          <textarea
            value={keywordValue}
            name="keywordValue"
            onChange={this.onChange}
          />
        </div>
        <div>
          <Button onClick={this.onSubmit}>Submit</Button>
        </div>
      </div>
    );
  }
}

export default Ask;
