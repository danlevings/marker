import React, { Component } from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import firebase from "firebase";
import styled from "styled-components";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const StyledTable = styled(Table)`
  margin-bottom: 60px;
  th {
    font-size: 21px;
    background: none !important;
  }

  tr,
  th {
    border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  }
`;
const REVIEW_OPTIONS = {
  A: "Excellent",
  B: "Good",
  C: "OK",
  D: "Not OK",
  E: "Fail"
};

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Question",
          dataIndex: "title",
          key: "question"
        },
        {
          title: "Answers",
          dataIndex: "answers",
          key: "answers"
        },
        {
          title: "Your results",
          dataIndex: "results",
          key: "results"
        },
        {
          title: "",
          dataIndex: "actions",
          key: "actions"
        }
      ],
      questions: null,
      answers: [],
      isAnswered: false,
      isReviewed: false
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    const questions = [];
    const answers = {};
    firebase
      .firestore()
      .collection("questions")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          questions.push({ ...doc.data(), id: doc.id });
        });

        firebase
          .firestore()
          .collection("answers")
          .get()
          .then(snapshot => {
            snapshot.forEach(d => {
              const answer = d.data();
              if (!answers[answer.questionId]) {
                answers[answer.questionId] = [];
              }
              answers[answer.questionId].push({ ...answer, id: d.id });
            });
            this.setState({
              questions,
              answers
            });
          });
      });
  };

  renderResults = question => {
    const { answers } = this.state;
    const currentUserAnswer = (answers[question.id] || []).find(
      answer => answer.author.uid === firebase.auth().currentUser.uid
    );
    const isReviewed = (currentUserAnswer || {}).isReviewed; // TODO: Get whether this question has been answered by user AND reviewed by author
    const isAnswered = !!currentUserAnswer;

    if (isReviewed) {
      return `${REVIEW_OPTIONS[currentUserAnswer.score]}! (${
        currentUserAnswer.score
      })`;
    }
    if (isAnswered) {
      return "Awaiting review";
    }
    return "Unanswered";
  };

  renderActions = question => {
    const { answers } = this.state;
    const currentUserAnswer = (answers[question.id] || []).find(
      answer => answer.author.uid === firebase.auth().currentUser.uid
    );
    const isAnswered = !!currentUserAnswer;
    if (isAnswered) {
      return <Button>Answered!</Button>;
    }
    return <Link to={`/answer/${question.id}`}>Answer</Link>;
  };

  render() {
    const { questions, answers, columns } = this.state;

    if (!questions) {
      return <Spinner />;
    }

    const dataSource = questions.map(question => ({
      ...question,
      title: (
        <div>
          <strong>{question.title}</strong>
          <br />
          {question.author.name}
        </div>
      ),
      answers: (answers[question.id] || []).length,
      results: this.renderResults(question),
      actions: this.renderActions(question)
    }));
    return (
      <div className="wrapper">
        <div style={{ textAlign: "center" }}>
          <h1 className="stroked">Questions</h1>
        </div>
        <StyledTable
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <BackButton to="/">Back to home</BackButton>
      </div>
    );
  }
}

export default Questions;
