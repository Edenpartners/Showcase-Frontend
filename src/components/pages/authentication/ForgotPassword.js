import React, { Component } from 'react';

import {
  FormGroup,
  Form,
  Row,
  Col,
  Input,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    return (
      <AuthenWrapper>
        <div style={bufferDivStyle} />
        <Col xs="3" sm="3">
          <p className="text-center" style={headerStyle}>
            Forgot your password?
          </p>
          <hr
            style={hrStyle}
          />
          <Form>
            <p style={textStyle}>
              {' '}
          Enter your Email address to reset your password.
            </p>
            <FormGroup>
              <Row className="pt-2">
                <Col xs="12" sm="12">
                  <Input
                    type="email"
                    name="email"
                    onChange={this.handleChange}
                    style={inputStyle}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row className="pt-2">
                <Col xs="12" sm="12">
                  <Button style={buttonColor}>
                    Send
                  </Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
          <div className="pt-4">
            <Link to="/authentication/sign-in">
              <p style={suggestStyle}>
              Back to Sign in
              </p>
            </Link>
          </div>
        </Col>
      </AuthenWrapper>
    );
  }
}


export default ForgotPassword;
const bufferDivStyle = {
  width: '37.5%',
};
const AuthenWrapper = styled.div`
  padding-top:70px;
  display: flex; 
  width: 100%;
  text-alight:center
  background-color: #1a3365;
  min-height: 100vh;
`;
const hrStyle = {
  backgroundColor: 'white',
  height: 2,
};
const headerStyle = {
  color: 'white',
  fontSize: 25,
  textAlign: 'center',
};
const textStyle = {
  color: 'white',
  fontSize: 18,
  textAlign: 'center',
};
const inputStyle = {
  height: '45px',
};

const buttonColor = {
  backgroundColor: 'black',
  height: '65px',
  width: '100%',
};
const suggestStyle = {
  color: 'white',
  fontSize: 14,
  textAlign: 'center',
};
