import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css';
import Search from '../Search/Search';
import Category from '../Category/Category';
import BreadCum from '../BreadCum/BreadCum';
import UserDropdown from '../UserDropdown/UserDropdown';
import { EDEN_HOME } from '../../../config';
import './HeaderBreadCrumb.css';

const logo = require('../../../assets/img/eden-logo-only.png');

const { Option } = Select;

class HeaderBreadCum extends React.Component {
  render() {
    const {
      showFilter, onTypeChange, handleSearch, onCategoryChanged,
    } = this.props;
    return (
      <div style={styles.wrapperStyle}>
        <Container>
          <Row>
            <Col md="10">
              <div className="pull-left">
                <a href={EDEN_HOME}>
                  <img src={logo} width="30" height="30" alt="Edenchain" />
                </a>
              </div>
              <div className="pull-left" style={{ marginLeft: 10 }}>
                <BreadCum />
              </div>
            </Col>
            <Col md="2">
              <div className="pull-right">
                <UserDropdown />
              </div>
            </Col>
          </Row>
          {showFilter && (
            <Row style={{ marginTop: 17 }}>
              <Col md="10">
                <Row>
                  <Col md="9">
                    <Search onSearch={handleSearch} />
                  </Col>
                </Row>
              </Col>
              <Col md="2">
                <Select
                  defaultValue="pending"
                  size="small"
                  className="float-right select-status"
                  onChange={onTypeChange}
                  style={styles.selectFilterStyle}
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="published">
                    Published
                  </Option>
                  <Option value="pending">
                    Pending
                  </Option>
                </Select>
              </Col>
            </Row>
          )}
          <Row>
            {showFilter && (
              <Col md="12" style={styles.categoryWrapper}>
                <Category onCategoryChanged={onCategoryChanged} />
              </Col>
            )}
          </Row>
        </Container>
      </div>
    );
  }
}

HeaderBreadCum.propTypes = {
  showFilter: PropTypes.bool,
  onTypeChange: PropTypes.func,
  handleSearch: PropTypes.func,
  onCategoryChanged: PropTypes.func,
};

HeaderBreadCum.defaultProps = {
  showFilter: true,
  onTypeChange: null,
  handleSearch: null,
  onCategoryChanged: null,
};

const styles = {
  wrapperStyle: {
    width: '100%',
    maxHeight: 144,
    background: '#004f50',
    paddingTop: 20,
    paddingBottom: 17,
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
  selectFilterStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  categoryWrapper: {
    marginTop: 16,
    marginBottom: 12,
  },
  pr20: {
    paddingRight: 20,
  },
};

export default HeaderBreadCum;
