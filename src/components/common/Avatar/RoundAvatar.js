import React from 'react';
import PropTypes from 'prop-types';

const defaultAvatar = require('../../../assets/img/user.png');

const RoundAvatar = ({ avatar, size }) => (
  <img
    src={avatar || defaultAvatar}
    alt="Avatar"
    style={{
      verticalAlign: 'middle',
      width: size,
      height: size,
      borderRadius: size,
      marginTop: 4,
    }}
  />
);

RoundAvatar.propTypes = {
  avatar: PropTypes.string,
  size: PropTypes.number,
};

RoundAvatar.defaultProps = {
  avatar: null,
  size: 30,
};

export default RoundAvatar;
