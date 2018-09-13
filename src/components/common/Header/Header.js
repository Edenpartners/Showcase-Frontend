import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';
import Search from '../Search/Search';
import Category from '../Category/Category';
import UserDropdown from '../UserDropdown/UserDropdown';
import { EDEN_HOME } from '../../../config';

const logo = require('../../../assets/img/eden-logo-curved.png');

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { handleSearch, onCategoryChanged } = this.props;
    return (
      <div style={styles.containerFluild}>
        <Container>
          <Row>
            <Col md="2">
              <a href={EDEN_HOME}>
                <img width="111" height="40" src={logo} alt="Logo" />
              </a>
            </Col>
            <Col md="8">
              <Search onSearch={handleSearch} />
            </Col>
            <Col md="2">
              <div className="pull-right">
                <UserDropdown />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12" style={styles.categoryWrapper}>
              <Category onCategoryChanged={onCategoryChanged} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Header.propTypes = {
  handleSearch: PropTypes.func,
  onCategoryChanged: PropTypes.func,
};

Header.defaultProps = {
  handleSearch: null,
  onCategoryChanged: null,
};

const styles = {
  pr20: {
    paddingRight: 20,
  },
  containerFluild: {
    width: '100%',
    height: '108px',
    background: '#004f50',
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
    color: '#67c0f3',
    // width: '100px',
    marginTop: 15,
    lineHeight: '1px',
    marginLeft: 10,
  },
  categoryWrapper: {
    marginTop: 16,
  },
};

export default Header;
