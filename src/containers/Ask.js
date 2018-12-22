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

const KeywordBox = styled.textarea`
  width: 100%;
  height: 200px;
  background: transparent;
  margin-bottom: 16px;
  font-size: 18px;
  padding: 4px 8px;

  &:focus {
    background: white;
  }
`;

const AskContainer = styled.div`
  width: 400px;
  margin: 20px auto;
`;

class Ask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleValue: "",
      keywordValue: ""
    };
  }

  onSubmit = () => {
    const { titleValue, keywordValue } = this.state;
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
        maxWordCount: 750,
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
      <div className="wrapper">
        <h1 className="stroked">Create a question</h1>
        <AskContainer>
          <div>What is the question?</div>
          <TextBox
            type="text"
            value={titleValue}
            name="titleValue"
            onChange={this.onChange}
          />
          <div>What could a possible answer look like?</div>
          <KeywordBox
            value={keywordValue}
            name="keywordValue"
            onChange={this.onChange}
          />
        </AskContainer>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <BackButton to="/">Back to answers</BackButton>
          <button className="button" onClick={this.onSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default Ask;
