import React from 'react';
import { API_ROOT } from '../../../config';
import UserContext from '../../../context/UserContext';
import RoundAvatar from '../../common/Avatar/RoundAvatar';

const defaultAvatar = require('../../../assets/img/user.png');

const WelcomeBox = () => (
  <UserContext.Consumer>
    {({ user }) => (
      <div style={styles.wrapper}>
        <h5>
          {`Hi, ${user.label ? user.label : 'User'}`}
        </h5>
        <RoundAvatar avatar={user.avatar ? `${API_ROOT}/${user.avatar}` : defaultAvatar} size={65} />
      </div>
    )}
  </UserContext.Consumer>
);

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
};

export default WelcomeBox;
