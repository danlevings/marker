import React, { Component } from "react";
import { notification } from "antd";
import firebase from "firebase";
import styled from "styled-components";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const AnswerBox = styled.textarea`
  width: 100%;
  height: 500px;
  background: transparent;
  font-size: 18px;
  padding: 4px 8px;

  &:focus {
    background: white;
  }
`;

const AnswerBoxContainer = styled.div`
  width: 100%;
  margin: 20px auto;
`;

class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      question: {},
      answerValue: ""
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { questionId }
      }
    } = this.props;

    firebase
      .firestore()
      .collection("questions")
      .doc(questionId)
      .get()
      .then(doc => {
        const question = { ...doc.data(), id: doc.id };
        this.setState({
          question,
          isLoading: false
        });
      });
  }

  onSubmit = () => {
    const { answerValue, question } = this.state;
    const { currentUser } = firebase.auth();
    firebase
      .firestore()
      .collection("answers")
      .add({
        answer: answerValue,
        author: {
          name: currentUser.displayName || currentUser.email,
          uid: currentUser.uid
        },
        comments: "",
        isReviewed: false,
        questionId: question.id,
        score: null
      })
      .then(docRef => {
        this.props.history.push("/questions");
        notification.success({ message: "You answered a question!" });

        var onAnswer = firebase.functions().httpsCallable("onAnswer");
        onAnswer({ questionId: question.id, answerId: docRef.id });
      });
  };

  render() {
    const { isLoading, question, answerValue } = this.state;

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <div className="wrapper" style={{ width: "70%" }}>
        <h1
          className="stroked"
          style={{
            textAlign: "center",
            fontSize: 42,
            margin: "0 auto"
          }}
        >
          {question.title}
        </h1>
        <AnswerBoxContainer>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Your answer</div>
          <AnswerBox
            value={answerValue}
            onChange={e =>
              this.setState({
                answerValue: e.target.value
              })
            }
          >
            Write your answer here...
          </AnswerBox>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <BackButton to="/questions">Back to questions</BackButton>
            <button className="button" onClick={this.onSubmit}>
              Submit
            </button>
          </div>
        </AnswerBoxContainer>
      </div>
    );
  }
}

export default Answer;
