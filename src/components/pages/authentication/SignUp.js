import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios/index';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Form,
  Row,
  Col,
  Button,
  Input,
  Label, Container,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../../../config';
import Authentication from '../../../services/Authentication';

const headerStyle = {
  color: 'white',
  fontSize: 36,
  textAlign: 'center',
};
const suggestStyle = {
  color: 'white',
  fontSize: 14,
  textAlign: 'center',
};
const inputStyle = {
  height: '48',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'solid 2px #4b8384',
  backgroundColor: '#004f50',
  paddingLeft: 0,
  borderRadius: 0,
  fontSize: 20,
  color: '#ffffff',
  outlineStyle: 'none',
  boxShadow: 'none',
  letterSpacing: '1px',
  fontFamily: 'Cabin',
};
const textAreaStyle = {
  height: '110',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'solid 2px #4b8384',
  backgroundColor: '#004f50',
  paddingLeft: 0,
  borderRadius: 0,
  fontSize: 20,
  color: '#ffffff',
  outlineStyle: 'none',
  boxShadow: 'none',
  letterSpacing: '1px',
  fontFamily: 'Cabin',
};
const italicStyle = {
  fontStyle: 'italic',
};
const linkBlueStyle = {
  color: '#39898a',
  textDecoration: 'underline',
};
const textColor = {
  fontSize: '16px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  color: '#39898a',
};

const buttonColor = {
  color: '#39898a',
  fontSize: '20px',
  height: '60px',
  width: '100%',
  borderRadius: '30px',
  backgroundColor: 'white',
};


class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      passWord: '',
      fullName: '',
      description: '',
      confirmPassWord: '',
      errors: {},
      response: {},
      SignUpFailMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.register = this.register.bind(this);
    this.handleSubmitEven = this.handleSubmitEven.bind(this);
  }

  handleSubmitEven(e) {
    if (e.key === 'Enter') {
      this.register();
    }
  }

  handleValidation() {
    const fields = this.state;
    const errors = {};
    let formIsValid = true;

    if (fields.email || fields.passWord || fields.email !== '' || fields.passWord !== '' || fields.confirmPassWord || fields.confirmPassWord !== ''
      || fields.fullName || fields.fullName !== '') {
      this.setState({
        SignUpFailMessage: '',
      });
    }

    // Email
    if (!fields.email || fields.email === '') {
      formIsValid = false;
      errors.email = 'Email cannot be empty';
      formIsValid = false;
    }

    if (typeof fields.email !== 'undefined') {
      const lastAtPos = fields.email.lastIndexOf('@');
      const lastDotPos = fields.email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields.email.indexOf('@@') === -1 && lastDotPos > 2 && (fields.email.length - lastDotPos) > 2)) {
        formIsValid = false;
        errors.email = 'Email is invalid';
        formIsValid = false;
      }
    }
    // password
    if (!fields.passWord || fields['passWord' === '']) {
      errors.passWord = 'Password cannot be empty';
      formIsValid = false;
    }
    if (fields.passWord.length < 6) {
      errors.passWord = 'Your password must be at least 6 characters';
      formIsValid = false;
    }
    // confirm password
    if (fields.passWord !== fields.confirmPassWord) {
      errors.confirmPassWord = 'Password does not match the confirm password !';
      formIsValid = false;
    }
    // full name
    if (!fields.fullName || fields.fullName === '') {
      errors.fullName = 'Full name cannot be empty';
      formIsValid = false;
    }
    if (fields.fullName.length > 100) {
      errors.fullName = 'Full name must be maximum 100 characters';
      formIsValid = false;
    }
    if (fields.description.length > 300) {
      errors.description = 'Description must be maximum 300 characters';
      formIsValid = false;
    }

    this.setState({ errors });
    return formIsValid;
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  register() {
    if (this.handleValidation()) {
      const {
        fullName, passWord, email, description,
      } = this.state;
      const { history, handleUserUpdate } = this.props;
      axios.post(`${API_ROOT}/accounts`, {
        password: passWord,
        email,
        description,
        label: fullName,
      }).then((response) => {
        Authentication.storeAuthKey(response.data.authorization);
        history.push('/account/my-profile');
        if (typeof handleUserUpdate === 'function') {
          handleUserUpdate();
        }
      }).catch(
        () => {
          this.setState({
            SignUpFailMessage: 'Sign up fail, please try again !!',
          });
        },
      );
    }
  }

  render() {
    const { errors, SignUpFailMessage } = this.state;
    return (
      <AuthenWrapper>
        <Container>
          <Row>
            <Col xs="12" md="5" sm="10" style={{ margin: '0 auto' }}>
              <p className="text-center" style={headerStyle}>
                 SIGN UP
              </p>
              <Form>
                <FormGroup>
                  <Row>
                    <span style={{ color: 'red', float: 'left' }}>
                      {SignUpFailMessage}
                    </span>
                  </Row>
                  <Row className="pt-2">
                    <Label style={textColor}>
                  Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                      style={inputStyle}
                      required
                    />
                    <span style={{ color: 'red' }}>
                      {errors.email}
                    </span>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row className="pt-2">

                    <Label style={textColor}>
                  Password
                    </Label>
                    <Input
                      type="password"
                      name="passWord"
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                      style={inputStyle}
                      required
                    />
                    <span style={{ color: 'red' }}>
                      {errors.passWord}
                    </span>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row className="pt-2">
                    <Label style={textColor}>
                  Confirm Password
                    </Label>
                    <Input
                      type="password"
                      name="confirmPassWord"
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                      style={inputStyle}
                      required
                    />
                    <span style={{ color: 'red' }}>
                      {errors.confirmPassWord}
                    </span>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row className="pt-2">
                    <Label style={textColor}>
                  Full name
                    </Label>
                    <Input
                      type="text"
                      name="fullName"
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                      style={inputStyle}
                      required
                    />
                    <span style={{ color: 'red' }}>
                      {errors.fullName}
                    </span>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row className="pt-2">
                    <Label style={textColor}>
                  Description
                    </Label>

                    <Input
                      type="textarea"
                      name="description"
                      style={textAreaStyle}
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                    />
                    <span style={{ color: 'red' }}>
                      {errors.description}
                    </span>
                  </Row>
                </FormGroup>
                <Row className="pt-2">
                  <Button style={buttonColor} onClick={this.register}>
                      Create Account
                  </Button>
                </Row>
              </Form>
              <div className="pt-4 text-center">
                <Link to="/authentication/sign-in">
                  <p style={italicStyle}>
                    <span style={suggestStyle}>
                    Already have an Account ? &nbsp;
                    </span>
                    <a style={linkBlueStyle}>
                    Sign in here !
                    </a>
                  </p>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </AuthenWrapper>
    );
  }
}

SignUp.propTypes = {
  handleUserUpdate: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

SignUp.defaultProps = {
  handleUserUpdate: null,
  history: {
    push: null,
  },
};

const AuthenWrapper = styled.div`
  padding-top:70px;
  display: flex; 
  width: 100%;
  text-alight:center
  background-color: #004f50;
  min-height: 100vh;
  input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-animation: autofill 0s forwards;
    animation: autofill 0s forwards;
}

@keyframes autofill {
    100% {
        background: transparent;
        color: white;
    }
}

@-webkit-keyframes autofill {
    100% {
        background: transparent;
        color: white;
    }
}
`;

export default SignUp;
