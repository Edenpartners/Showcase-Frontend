import * as React from 'react';
import { Col, Container } from 'reactstrap';
import 'font-awesome/css/font-awesome.min.css';

const logo = require('../../../assets/img/new-background.png');

class AuthenticationHeader extends React.Component {
  render() {
    return (
      <div style={styles.containerFluild} className="pt-5">
        <Container>
          <Col md="4" sm="10" xs="12" style={{ margin: '0 auto', textAlign: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '100%' }} />
          </Col>
        </Container>
      </div>
    );
  }
}

const styles = {
  containerFluild: {
    width: '100%',
    height: '140px',
    background: '#004f50',
    paddingTop: '20px',
  },
};

export default AuthenticationHeader;
