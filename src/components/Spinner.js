import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "antd";

const SpinnerIcon = styled(Icon)`
  position: fixed;
  top: 50%;
  left: 50%;
  font-size: 32px;
`;

class Spinner extends Component {
  state = {};
  render() {
    return <SpinnerIcon type="loading" />;
  }
}

export default Spinner;
