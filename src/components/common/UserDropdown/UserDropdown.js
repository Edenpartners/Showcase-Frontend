import * as React from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import {
  Dropdown, DropdownToggle, DropdownMenu,
} from 'reactstrap';
import Authentication from '../../../services/Authentication';
import UserContext from '../../../context/UserContext';
import { API_ROOT } from '../../../config';

const defaultAvatar = require('../../../assets/img/user.png');

class UserDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
    this.logout = this.logout.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  logout() {
    Authentication.removeAuthKey();
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <UserContext.Consumer>
          {({ user }) => (
            <DropdownToggle
              tag="span"
              className="row"
              onClick={this.toggle}
              data-toggle="dropdown"
              aria-expanded={this.state.dropdownOpen}
            >
              <img src={user.avatar ? `${API_ROOT}/${user.avatar}` : defaultAvatar} alt="Avatar" style={styles.avatar} />
              { (user.label && user.label.length > 16)
                ? (
                  <p style={styles.welcome}>
                    {`Hi, ${`${user.label.substring(0, 13)}...`}`}
                  </p>
                ) : (
                  <p style={styles.welcome}>
                    {`Hi, ${user.label ? user.label : 'User'}`}
                  </p>
                )
              }
            </DropdownToggle>
          )}
        </UserContext.Consumer>
        <DropdownMenu right>
          <div style={styles.linkStyle}>
            <Link to="/account/my-profile" style={styles.linkColor}>
              My info
            </Link>
          </div>
          <div style={styles.linkStyle}>
            <Link to="/account/dashboard" style={styles.linkColor}>
              My Dashboard
            </Link>
          </div>
          <div style={styles.linkStyle}>
            <Link to="/account/revenue" style={styles.linkColor}>
              Revenue
            </Link>
          </div>
          <div style={styles.linkStyle}>
            <Link to="/account/transactions" style={styles.linkColor}>
              Transaction List
            </Link>
          </div>
          <div style={styles.linkStyle}>
            <Link to="/account/product-management/All" style={styles.linkColor}>
              Product Management
            </Link>
          </div>
          <div style={styles.linkStyle}>
            <Link to="/account/message-box/all" style={styles.linkColor}>
              Message box
            </Link>
          </div>
          <div style={styles.linkStyle}>
            <a href="/edenchain_user_manual.pdf" target="_blank" style={styles.linkColor}>
              User manual
            </a>
          </div>
          <div style={styles.linkStyle}>
            <Link to="/authentication/sign-in" style={styles.linkColor} onClick={this.logout}>
              Sign Out
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default UserDropdown;
const styles = {
  linkStyle: {
    height: '25px',
    paddingLeft: 12,
  },
  containerFluild: {
    width: '100%',
    height: '108px',
    background: '#010228',
    paddingTop: '20px',
  },
  avatar: {
    verticalAlign: 'middle',
    width: 26,
    height: 26,
    borderRadius: 26,
    marginTop: 4,
    // marginLeft: '30px',
  },
  welcome: {
    flexWrap: 'wrap',
    color: '#ffffff',
    // width: '100px',
    marginTop: 15,
    lineHeight: '1px',
    marginLeft: 10,
    maxWidth: 154,
    whiteSpace: 'nowrap',
  },
  linkColor: {
    color: '#212529',
    display: 'block',
    fontSize: '15px',
  },
};
