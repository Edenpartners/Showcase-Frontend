import React, { Component } from 'react';
import styled from 'styled-components';
import {
  FormGroup,
  Form,
  Row,
  Col,
  Button,
  Input,
  Label, Container,
} from 'reactstrap';
import errorMessage from '../../common/WarningMessage/warningMessage';
import { patchRequest } from '../../../services/axiosApi';

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
};
const textColor = {
  letterSpacing: '1px',
  fontSize: '16px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  color: '#39898a',
};

const buttonColor = {
  backgroundColor: '#ffffff',
  height: '60px',
  width: '100%',
  borderRadius: '30px',
  color: '#39898a',
  fontSize: '20px',
};

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      newPassword: '',
      confirmPassword: '',
      errors: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmitEven = this.handleSubmitEven.bind(this);
  }

  handleValidation() {
    const fields = this.state;
    const errors = {};
    let formIsValid = true;

    // // password
    // if (!fields.currentPassword || fields['currentPassword' === '']) {
    //   errors.currentPassword = 'Please input current password';
    //   formIsValid = false;
    // }
    // if (fields.currentPassword.length < 6 || fields.currentPassword.length > 20) {
    //   errors.currentPassword = 'Your password must be at least 6 characters and maximum 20 characters';
    //   formIsValid = false;
    // }
    // confirm password
    if (fields.newPassword !== fields.confirmPassword) {
      errors.confirmPassword = 'New password does not match the confirm password !';
      formIsValid = false;
    }
    if (fields.confirmPassword === '' || fields.confirmPassword.length === 0) {
      errors.confirmPassword = 'Please input Confirm new password';
      formIsValid = false;
    }
    // newPassword
    if (fields.newPassword === '') {
      errors.newPassword = 'Please input New password !';
      formIsValid = false;
    }
    if (fields.newPassword.length < 6 || fields.newPassword.length > 20) {
      errors.newPassword = 'Your New Password must be at least 6 characters and maximum 20 characters';
      formIsValid = false;
    }

    this.setState({ errors });
    return formIsValid;
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmitEven(e) {
    if (e.key === 'Enter') {
      this.changePassword();
    }
  }

  changePassword() {
    if (this.handleValidation()) {
      const data = {
        password: this.state.newPassword,
        // currentPassword: this.state.currentPassword,
      };
      if (this.handleValidation()) {
        const api = patchRequest(data, 'accounts');
        api.then(() => {
          this.props.history.push('/account/my-profile');
        }).catch(() => {
          errorMessage(false, 'Error, please try again !!', 3);
        });
      }
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <AuthenWrapper>
        <Container>
          <Row>
            <Col xs="12" md="5" sm="10" style={{ margin: '0 auto' }}>
              <p className="text-center" style={headerStyle}>
                CHANGE PASSWORD
              </p>
              <Form>
                {/* <FormGroup> */}
                {/* <Row className="pt-2"> */}
                {/* <Label style={textColor}> */}
                {/* Current password */}
                {/* </Label> */}
                {/* <Input */}
                {/* type="password" */}
                {/* name="currentPassword" */}
                {/* onChange={this.handleChange} */}
                {/* style={inputStyle} */}
                {/* required */}
                {/* /> */}
                {/* <span style={{ color: 'red' }}> */}
                {/* {errors.currentPassword} */}
                {/* </span> */}
                {/* </Row> */}
                {/* </FormGroup> */}
                <FormGroup>
                  <Row className="pt-2">

                    <Label style={textColor}>
                      New password
                    </Label>
                    <Input
                      type="password"
                      name="newPassword"
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                      style={inputStyle}
                      required
                    />
                    <span style={{ color: 'red' }}>
                      {errors.newPassword}
                    </span>

                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row className="pt-2">
                    <Label style={textColor}>
                      Confirm new password
                    </Label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      onChange={this.handleChange}
                      onKeyPress={this.handleSubmitEven}
                      style={inputStyle}
                      required
                    />
                    <span style={{ color: 'red' }}>
                      {errors.confirmPassword}
                    </span>
                  </Row>
                </FormGroup>

                <Row className="pt-2">
                  <Button style={buttonColor} onClick={this.changePassword}>
                    Change password
                  </Button>
                </Row>

              </Form>
            </Col>
          </Row>
        </Container>
      </AuthenWrapper>
    );
  }
}

const AuthenWrapper = styled.div`
  padding-top:70px;
  display: flex; 
  width: 100%;
  text-alight:center
  background-color: #004f50;
  min-height: calc(100vh - 140px);
}
`;

export default ChangePassword;
