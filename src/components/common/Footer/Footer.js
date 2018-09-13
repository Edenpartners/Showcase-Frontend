import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { EDEN_HOME } from '../../../config';

const logo = require('../../../assets/img/eden-logo-curved.png');

class Footer extends React.Component {
  render() {
    return (
      <div style={styles.containerFluild}>
        <Container>
          <Row>
            <Col md="2">
              <a href={EDEN_HOME}>
                <img width="72" height="26" src={logo} alt="Logo" />
              </a>
            </Col>
            <Col md="7">

              <span className="pr-3">
                <a href="https://t.me/edenchainio" rel="noopener noreferrer" target="_blank">
                  <i className="fa fa-telegram text-white fa-2x" aria-hidden="true" />
                </a>
              </span>
              <span className="pr-3">
                <a href="https://www.reddit.com/r/edenchainio/" rel="noopener noreferrer" target="_blank">
                  <i className="fa fa-reddit text-white fa-2x" aria-hidden="true" />
                </a>

              </span>
              <span className="pr-3">
                <a href="https://twitter.com/edenchainio" rel="noopener noreferrer" target="_blank">
                  <i className="fa fa-twitter text-white fa-2x" aria-hidden="true" />
                </a>

              </span>
              <span className="pr-3">
                <a href="https://www.facebook.com/edenchainio/" rel="noopener noreferrer" target="_blank">
                  <i className="fa fa-facebook-square text-white fa-2x" aria-hidden="false" />
                </a>

              </span>
            </Col>
            <Col md="3">
              <p style={styles.textEden} className="float-right">
                © 2018 Eden Partners Inc.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
const styles = {
  containerFluild: {
    width: '100%',
    height: '70px',
    background: '#004f50',
    paddingTop: '20px',
  },
  avatar: {
    verticalAlign: 'middle',
    width: 23,
    height: 23,
    borderRadius: 26,
    marginTop: 4,
    // marginLeft: '30px',
  },
  textEden: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#ffffff',
  },
};

export default Footer;
