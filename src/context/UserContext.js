import React from 'react';

const UserContext = React.createContext({
  user: {
    balance: 0,
    rate: 1,
  },
  handleUserUpdate: null,
});

export default UserContext;
