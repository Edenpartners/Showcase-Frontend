import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Authentication from '../../../services/Authentication';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (Authentication.isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/authentication/sign-in',
          state: { from: props.location },
        }}
      />
    ))
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

PrivateRoute.defaultProps = {
  component: null,
  location: null,
};

export default PrivateRoute;
