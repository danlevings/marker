import React, { Component } from "react";
import { Table } from "antd";
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
      return <Spinner />;
    }
    return (
      <div className="wrapper">
        <div style={{ textAlign: "center" }}>
          <h1 className="stroked">Your questions</h1>
        </div>
        {questions.length > 0 ? (
          <StyledTable
            dataSource={questions.map(question => ({
              ...question,
              nAnswers: (answers[question.id] || []).length
            }))}
            columns={columns}
            pagination={false}
            expandedRowRender={record => (
              <StyledTable
                dataSource={(answers[record.id] || []).map(answer => ({
                  ...answer,
                  author: answer.author.name || answer.author.email,
                  actions: answer.isReviewed ? (
                    <Link to={`/review/${answer.id}`}>
                      {answer.score} (Rereview)
                    </Link>
                  ) : (
                    <Link to={`/review/${answer.id}`}>Review</Link>
                  )
                }))}
                columns={[
                  {
                    title: "Author",
                    dataIndex: "author",
                    key: "author"
                  },
                  {
                    title: "",
                    dataIndex: "actions",
                    key: "actions"
                  }
                ]}
              />
            )}
          />
        ) : (
          <div style={{ marginBottom: 60 }}>No data here</div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <BackButton to="/">Back to home</BackButton>
          <Link to="/ask" className="button">
            Ask a new question
          </Link>
        </div>
      </div>
    );
  }
}

export default Answers;
