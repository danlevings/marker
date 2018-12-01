import React, { Component } from "react";
import { Button, Icon, notification } from "antd";
import styled from "styled-components";
import firebase from "firebase";

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 700px;

  .user-answer {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
  }
  .your-assessment {
    grid-column: 4 / 5;
    grid-row: 1 / 2;
    display: flex;
    flex-direction: column;
  }
  .our-assessment {
    grid-column: 5 / 6;
    grid-row: 1 / 2;
  }

  .comments {
    grid-column: 4 / 7;
    grid-row: 2 / 3;
  }

  .assessment {
    width: 100%;
    height: 20%;
  }
`;

const REVIEW_OPTIONS = {
  A: "Excellent",
  B: "Good",
  C: "OK",
  D: "Not OK",
  E: "Fail"
};

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      answer: {},
      selectedReview: null,
      machineAssessment: null,
      comments: ""
    };
  }

  componentDidMount() {
    this.getAnswer();
  }

  getAnswer = () => {
    const {
      match: {
        params: { answerId }
      }
    } = this.props;
    firebase
      .firestore()
      .collection("answers")
      .doc(answerId)
      .get()
      .then(doc => {
        this.setState({
          answer: { ...doc.data(), id: doc.id },
          isLoading: false
        });

        firebase
          .firestore()
          .collection("modelResults")
          .where("answerId", "==", answerId)
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                machineAssessment: doc.data().modelResults
              });
            }
          });
      });
  };

  onAssess = selectedReview => {
    this.setState({
      selectedReview
    });
  };

  onSubmit = () => {
    const {
      match: {
        params: { answerId }
      }
    } = this.props;
    const { selectedReview, comments } = this.state;
    firebase
      .firestore()
      .collection("answers")
      .doc(answerId)
      .update({
        comments,
        isReviewed: true,
        score: selectedReview
      })
      .then(() => {
        notification.success({ message: "Answer reviewed!" });
        this.props.history.push("/answers");
      });
  };

  render() {
    const {
      isLoading,
      answer,
      machineAssessment,
      selectedReview,
      comments
    } = this.state;
    if (isLoading) {
      return <Icon type="loading" />;
    }
    return (
      <div>
        <h1 className="stroked">How has IT affected our society?</h1>
        <Container>
          <div className="user-answer">
            <div>User answer</div>
            <textarea value={answer.answer} disabled />
          </div>
          <div className="your-assessment">
            <div>Your assessment</div>
            {Object.keys(REVIEW_OPTIONS).map(key => (
              <div className="assessment">
                <Button
                  onClick={() => this.onAssess(key)}
                  type={selectedReview === key ? "primary" : "default"}
                >
                  {REVIEW_OPTIONS[key]}
                </Button>
              </div>
            ))}
          </div>
          {machineAssessment && (
            <div className="our-assessment">
              <div>Our assessment</div>
              <div className="assessment">0.1</div>
              <div className="assessment">0.4</div>
              <div className="assessment">0.7</div>
              <div className="assessment">0.6</div>
              <div className="assessment">0.1</div>
            </div>
          )}
          <div className="comments">
            <div>Comments</div>
            <textarea
              value={comments}
              onChange={e =>
                this.setState({
                  comments: e.target.value
                })
              }
            />
            <Button onClick={this.onSubmit}>Submit</Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default Review;
