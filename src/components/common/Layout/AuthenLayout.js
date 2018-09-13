import React, { Component } from 'react';
import {
  Route,
} from 'react-router-dom';
import SignUp from '../../pages/authentication/SignUp';
import SignIn from '../../pages/authentication/SignIn';
import ForgotPassword from '../../pages/authentication/ForgotPassword';
import ChangePassword from '../../pages/authentication/ChangePassword';
import AuthenticationHeader from '../../pages/authentication/AuthenticationHeader';
import UserContext from '../../../context/UserContext';


class AuthenLayout extends Component {
  render() {
    return (
      <div>
        <AuthenticationHeader />
        <UserContext.Consumer>
          {({ handleUserUpdate }) => (
            <div>
              <Route path={`${this.props.match.url}/sign-up`} render={props => (<SignUp {...props} handleUserUpdate={handleUserUpdate} />)} />
              <Route path={`${this.props.match.url}/sign-in`} render={props => (<SignIn {...props} handleUserUpdate={handleUserUpdate} />)} />
            </div>
          )}
        </UserContext.Consumer>
        <Route path={`${this.props.match.url}/forgot-password`} component={ForgotPassword} />
        <Route path={`${this.props.match.url}/change-password`} component={ChangePassword} />
      </div>
    );
  }
}

export default AuthenLayout;
