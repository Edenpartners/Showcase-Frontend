import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import './FilterGroup.css';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import Search from '../Search/Search';

const { Option } = Select;

class FilterGroup extends Component {
  render() {
    const {
      onDateChange, onStatusChange, onTypeChange, searchInput, onSearch, style, showType,
    } = this.props;
    const wrapperStyle = Object.assign({}, styles.wrapperStyle, style);
    return (
      <div style={wrapperStyle}>
        <Container>
          <Row>
            {searchInput && (
              <Col md="7">
                <Search onSearch={onSearch} />
              </Col>
            )}
            <Col md="3" sm="6">
              <DateRangePicker onChange={onDateChange} />
            </Col>
            <Col md="1">
              {showType && (
                <Select size="small" placeholder="Type" onChange={onTypeChange} style={styles.typeStyle} dropdownMatchSelectWidth={false}>
                  <Option value="Purchases">
                    Purchase
                  </Option>
                  <Option value="Sales">
                    Sales
                  </Option>
                </Select>
              )}
            </Col>
            <Col md="1">
              {showType && (
                <Select size="small" placeholder="Status" onChange={onStatusChange} style={styles.statusStyle} dropdownMatchSelectWidth={false}>
                  <Option value="on_dealing">
                    On dealing
                  </Option>
                  <Option value="completed">
                    Completed
                  </Option>
                </Select>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

FilterGroup.propTypes = {
  onDateChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onTypeChange: PropTypes.func,
  onSearch: PropTypes.func,
  searchInput: PropTypes.bool,
  showType: PropTypes.bool,
  style: PropTypes.shape({
    background: PropTypes.string,
  }),
};

FilterGroup.defaultProps = {
  onDateChange: null,
  onStatusChange: null,
  onTypeChange: null,
  onSearch: null,
  searchInput: false,
  showType: false,
  style: null,
};

const styles = {
  wrapperStyle: {
    marginBottom: 25,
    backgroundColor: '#e1e4ea',
    borderColor: '#cfcfcf',
    paddingBottom: 8,
    paddingTop: 9,
  },
  typeStyle: {
    minWidth: 65,
    marginTop: 3,
  },
  statusStyle: {
    minWidth: 75,
    marginTop: 3,
  },
};

export default FilterGroup;
