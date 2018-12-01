import React, { Component } from "react";
import { Button, Icon, notification } from "antd";
import firebase from "firebase";

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

    console.log(questionId);
  }

  onSubmit = () => {
    const { answerValue, question } = this.state;
    const { currentUser } = firebase.auth();
    firebase
      .firestore()
      .collection("answers")
      .doc()
      .set({
        answer: answerValue,
        author: {
          name: currentUser.displayName,
          uid: currentUser.uid
        },
        comments: "",
        isReviewed: false,
        questionId: question.id,
        score: null
      })
      .then(() => {
        this.props.history.push("/questions");
        notification.success({ message: "You answered a question!" });
      });
  };

  render() {
    const { isLoading, question, answerValue } = this.state;

    if (isLoading) {
      return <Icon type="loading" />;
    }

    return (
      <div>
        <h1 className="stroked">{question.title}</h1>
        <span>Your answer</span>
        <textarea
          value={answerValue}
          onChange={e =>
            this.setState({
              answerValue: e.target.value
            })
          }
        >
          Write your answer here...
        </textarea>
        <Button onClick={this.onSubmit}>Submit</Button>
      </div>
    );
  }
}

export default Answer;
