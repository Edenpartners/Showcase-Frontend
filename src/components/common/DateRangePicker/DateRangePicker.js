import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import './DateRangePicker.css';

const { RangePicker } = DatePicker;

class DateRangePicker extends Component {
  render() {
    const { startDate, endDate, onChange } = this.props;

    return (
      <RangePicker format="DD/MM/YYYY" onChange={onChange} defaultValue={[startDate, endDate]} style={styles.dateRangeStyle} size="small" />
    );
  }
}

DateRangePicker.propTypes = {
  startDate: PropTypes.objectOf(moment),
  endDate: PropTypes.objectOf(moment),
  onChange: PropTypes.func,
};

DateRangePicker.defaultProps = {
  startDate: moment().subtract(2, 'months'),
  endDate: moment(),
  onChange: () => {},
};

const styles = {
  dateRangeStyle: {
    background: 'none',
    lineHeight: 2,
  },
};

export default DateRangePicker;
