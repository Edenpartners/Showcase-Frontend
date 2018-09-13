import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
import axios from 'axios/index';
import { API_ROOT } from '../../../config';
import Authentication from '../../../services/Authentication';

const AuthenWrapper = styled.div`
  padding-top:70px;
  display: flex; 
  width: 100%;
  text-alight:center
  background-color: #004f50;
  min-height: calc(100vh - 140px);
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
const headerStyle = {
  color: 'white',
  fontSize: 36,
  textAlign: 'center',
};
const inputStyle = {
  height: '50',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'solid 2px #4b8384',
  backgroundColor: '#004f50',
  paddingLeft: 0,
  borderRadius: 0,
  fontSize: 21,
  color: '#ffffff',
  outlineStyle: 'none',
  boxShadow: 'none',
  letterSpacing: '1px',
  fontFamily: 'Cabin',

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
const italicStyle = {
  fontStyle: 'italic',
};
const buttonColor = {
  backgroundColor: '#ffffff',
  height: '60px',
  width: '100%',
  borderRadius: '30px',
  color: '#39898a',
  fontSize: '20px',
};
const buttonOrangeColor = {
  backgroundColor: '#ff8976',
  height: '58px',
  width: '80%',
  borderRadius: '30px',
  color: '#ffffff',
  fontSize: '17px',
};
const suggestStyle = {
  color: 'white',
  fontSize: 14,
  textAlign: 'center',
};

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      passWord: '',
      errors: {},
      LoginFailMessage: '',
      response: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.login = this.login.bind(this);
    this.handleSubmitEven = this.handleSubmitEven.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (Authentication.isAuthenticated()) {
      history.push('/store/offers/All');
    }
  }

  login() {
    if (this.handleValidation()) {
      const { history, handleUserUpdate } = this.props;
      const { passWord, email } = this.state;
      axios.post(`${API_ROOT}/authorization`, {
        password: passWord,
        email,
      }).then((response) => {
        Authentication.storeAuthKey(response.data.authorization);
        history.push('/store/offers/All');
        if (typeof handleUserUpdate === 'function') {
          handleUserUpdate();
        }
      }).catch(
        () => {
          this.setState({
            LoginFailMessage: 'Please input correct the email and password !!',
          });
        },
      );
    }
  }

  handleSubmitEven(e) {
    if (e.key === 'Enter') {
      this.login();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleValidation() {
    const fields = this.state;
    const errors = {};
    let formIsValid = true;

    if (fields.email || fields.passWord || fields.email !== '' || fields.passWord !== '') {
      this.setState({
        LoginFailMessage: '',
      });
    }
    // Email
    if (!fields.email || fields.email === '') {
      formIsValid = false;
      errors.email = 'Please input email';
    } else if (typeof fields.email !== 'undefined') {
      const lastAtPos = fields.email.lastIndexOf('@');
      const lastDotPos = fields.email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields.email.indexOf('@@') === -1 && lastDotPos > 2 && (fields.email.length - lastDotPos) > 2)) {
        formIsValid = false;
        errors.email = 'Email  is invalid';
      }
    }
    // password
    if (!fields.passWord || fields.passWord === '') {
      formIsValid = false;
      errors.passWord = 'Please input password';
    }

    this.setState({ errors });
    return formIsValid;
  }

  render() {
    const { errors, LoginFailMessage } = this.state;
    return (
      <AuthenWrapper>
        <Container>
          <Row>
            <Col xs="12" md="5" sm="10" style={{ margin: '0 auto' }}>
              <p className="text-center" style={headerStyle}>
              SIGN IN
              </p>
              <Form>
                <FormGroup>
                  <span style={{ color: 'red' }}>
                    {LoginFailMessage}
                  </span>
                  <div className="pt-2">
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
                  </div>
                </FormGroup>
                <FormGroup>
                  <div>
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
                  </div>
                  {/* <p className="text-right pt-2" style={italicLinkBlueStyle}> */}
                  {/* Forgot password? */}
                  {/* </p> */}
                </FormGroup>
                <Col xs="12" sm="12">
                  <Row className="pt-2">
                    <Button style={buttonColor} onClick={this.login}>
                    Sign in
                    </Button>
                  </Row>
                </Col>
              </Form>
              <div className="pt-5 text-center">
                <p style={italicStyle}>
                  <span style={suggestStyle}>
                    Don't have an Account ?
                  </span>
                  <Link to="/authentication/sign-up">
                    <div className="pt-2">
                      <Button style={buttonOrangeColor}>
                        Sign up and get free 1000 EDN
                      </Button>
                    </div>
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </AuthenWrapper>
    );
  }
}

SignIn.propTypes = {
  handleUserUpdate: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

SignIn.defaultProps = {
  handleUserUpdate: null,
  history: {
    push: null,
  },
};

export default SignIn;
