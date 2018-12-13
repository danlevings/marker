import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "antd";
import { Link } from "react-router-dom";

const BackButton = styled(Link)`
  position: fixed;
  top: 20px;
  left: 20px;
  border: none;
  font-size: 18px;
`;

class Spinner extends Component {
  state = {};
  render() {
    return (
      <BackButton to={this.props.to} className="button">
        <Icon type="arrow-left" /> {this.props.children}
      </BackButton>
    );
  }
}

export default Spinner;
