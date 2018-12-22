import React, { Component } from "react";
import { notification, Icon } from "antd";
import styled from "styled-components";
import firebase from "firebase";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

const Subtitle = styled.div`
  padding-bottom: 8px;
`;

const TextBox = styled.textarea`
  width: 100%;
  height: 100%;
  background: transparent;
  margin-bottom: 16px;
  font-size: 18px;
  padding: 4px 8px;

  &:focus {
    background: white;
  }
`;

const Container = styled.main`
  display: grid;
  grid-gap: 20px
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 80%;
  margin: 0 auto;
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
    padding-bottom: 8px;
    font-size: 21px;
  }
  .machine-assessment {
    width: 100%;
    padding: 8px 16px 13px;
    font-size: 21px;
    border-left: 4px solid black;
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
      isLoadingMachine: true,
      answer: {},
      question: {},
      selectedReview: null,
      machineAssessment: null,
      comments: "",
      questionTitle: ""
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
        const data = doc.data();
        this.setState({
          answer: { ...data, id: doc.id },
          comments: data.comments || "",
          selectedReview: data.score || null,
          isLoading: false
        });

        firebase
          .firestore()
          .collection("modelResults")
          .doc(answerId)
          .get()
          .then(doc => {
            if (doc.exists) {
              this.setState({
                machineAssessment: doc.data().modelResults,
                isLoadingMachine: false
              });
            }
          });
      });
  };

  onRefresh = () => {
    const {
      match: {
        params: { answerId }
      }
    } = this.props;
    const { answer } = this.state;
    this.setState({
      isLoadingMachine: true
    });
    var onAnswer = firebase.functions().httpsCallable("onAnswer");
    onAnswer({ questionId: answer.questionId, answerId }).then(result => {
      console.log("onRefresh", result);
      this.setState({
        machineAssessment: result.data,
        isLoadingMachine: false
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
    const { selectedReview, comments, answer } = this.state;
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

        var onReview = firebase.functions().httpsCallable("onReview");
        onReview({ questionId: answer.questionId, answerId: answer.id }).then(
          result => {
            console.log(result);
          }
        );
      });
  };

  renderMachineAssessment = letter => {
    const { isLoadingMachine, machineAssessment } = this.state;
    if (isLoadingMachine) {
      return <Icon type="loading" />;
    }
    return parseFloat(machineAssessment[letter]).toFixed(3);
  };

  render() {
    const {
      isLoading,
      answer,
      machineAssessment,
      selectedReview,
      comments,
      isLoadingMachine
    } = this.state;
    if (isLoading) {
      return <Spinner />;
    }
    return (
      <div style={{ width: "100%", marginTop: 60 }}>
        <h1
          className="stroked"
          style={{
            textAlign: "center",
            fontSize: 42,
            width: "80%",
            margin: "0 auto",
            marginBottom: 16
          }}
        >
          How has IT affected our society?
        </h1>
        <Container>
          <div className="user-answer">
            <Subtitle>User answer</Subtitle>
            <TextBox value={answer.answer} disabled />
          </div>
          <div className="your-assessment">
            <Subtitle>Your assessment</Subtitle>
            {Object.keys(REVIEW_OPTIONS).map(key => (
              <div className="assessment">
                <button
                  className="button"
                  style={{
                    width: "100%",
                    background:
                      selectedReview === key ? "black" : "transparent",
                    color: selectedReview === key ? "white" : "black"
                  }}
                  onClick={() => this.onAssess(key)}
                >
                  {REVIEW_OPTIONS[key]}
                </button>
              </div>
            ))}
          </div>
          {machineAssessment && (
            <div className="our-assessment">
              <Subtitle>
                Our assessment{" "}
                {!isLoadingMachine && (
                  <Icon
                    type="reload"
                    onClick={this.onRefresh}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </Subtitle>

              <div
                className="machine-assessment"
                style={{
                  borderLeft: `4px solid hsl(${machineAssessment.A *
                    100}, 50%, 50%)`
                }}
              >
                {this.renderMachineAssessment("A")}
              </div>
              <div
                className="machine-assessment"
                style={{
                  borderLeft: `4px solid hsl(${machineAssessment.B *
                    100}, 50%, 50%)`
                }}
              >
                {this.renderMachineAssessment("B")}
              </div>
              <div
                className="machine-assessment"
                style={{
                  borderLeft: `4px solid hsl(${machineAssessment.C *
                    100}, 50%, 50%)`
                }}
              >
                {this.renderMachineAssessment("C")}
              </div>
              <div
                className="machine-assessment"
                style={{
                  borderLeft: `4px solid hsl(${machineAssessment.D *
                    100}, 50%, 50%)`
                }}
              >
                {this.renderMachineAssessment("D")}
              </div>
              <div
                className="machine-assessment"
                style={{
                  borderLeft: `4px solid hsl(${machineAssessment.E *
                    100}, 50%, 50%)`
                }}
              >
                {this.renderMachineAssessment("E")}
              </div>
            </div>
          )}
          <div className="comments">
            <div>Comments</div>
            <TextBox
              value={comments}
              style={{ height: 200 }}
              onChange={e =>
                this.setState({
                  comments: e.target.value
                })
              }
            />
            <BackButton to="/answers">Back to answers</BackButton>
            <button className="button" onClick={this.onSubmit}>
              {answer.score ? "Rereview" : "Submit Review"}
            </button>
          </div>
        </Container>
      </div>
    );
  }
}

export default Review;
