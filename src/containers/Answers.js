import React, { Component } from "react";
import { Table, Icon } from "antd";
import { Link } from "react-router-dom";
import firebase from "firebase";
class Answers extends Component {
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
          dataIndex: "nAnswers",
          key: "answers"
        },
        {
          title: "Score",
          dataIndex: "score",
          key: "score"
        }
      ],
      isLoading: true,
      questions: []
    };
  }

  componentDidMount() {
    if (firebase.auth().currentUser) {
      this.getQuestions();
    }
  }

  getQuestions = () => {
    const questions = [];
    const answers = {};
    firebase
      .firestore()
      .collection("questions")
      .where("author.uid", "==", firebase.auth().currentUser.uid)
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
              isLoading: false,
              questions,
              answers
            });
          });
      });
  };

  render() {
    const { questions, answers, columns, isLoading } = this.state;

    if (isLoading) {
      return <Icon type="loading" />;
    }
    return (
      <div className="wrapper">
        <h1>Your questions</h1>
        <Table
          dataSource={questions.map(question => ({
            ...question,
            nAnswers: (answers[question.id] || []).length
          }))}
          columns={columns}
          expandedRowRender={record => (
            <Table
              dataSource={(answers[record.id] || []).map(answer => ({
                ...answer,
                author: answer.author.name,
                actions: answer.isReviewed ? (
                  <span>Reviewed! {answer.score}</span>
                ) : (
                  <Link to={`/review/${answer.id}`}>Review</Link>
                )
              }))}
              pagination={false}
              columns={[
                {
                  title: "author",
                  dataIndex: "author",
                  key: "author"
                },
                {
                  title: "actions",
                  dataIndex: "actions",
                  key: "actions"
                }
              ]}
            />
          )}
        />
        <Link to="/" className="button">
          Back to home
        </Link>
        <Link to="/ask" className="button">
          Ask a new question
        </Link>
      </div>
    );
  }
}

export default Answers;
