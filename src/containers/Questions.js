import React, { Component } from "react";
import { Table, Button, Icon } from "antd";
import { Link } from "react-router-dom";
import firebase from "firebase";

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
      return <Icon type="loading" />;
    }

    const dataSource = questions.map(question => ({
      ...question,
      title: (
        <div>
          {question.title}
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
        <h1>Questions</h1>
        <Table dataSource={dataSource} columns={columns} />
        <Link to="/" className="button">
          Back to home
        </Link>
      </div>
    );
  }
}

export default Questions;
