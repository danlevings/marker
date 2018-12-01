import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="wrapper" style={{ textAlign: "center" }}>
        <h1 className="stroked">Marker</h1>
        <div
          style={{
            width: 300,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Link to="/questions" className="button">
            Answer
          </Link>
          <Link to="/answers" className="button">
            Ask
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
