import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';

import './Pager.css';

const Pager = (
  {
    currentPage, pageSize, totalItem, pageChanged, className,
  },
) => (
  <Pagination
    style={{ marginBottom: 10 }}
    className={className}
    defaultCurrent={1}
    current={currentPage}
    pageSize={pageSize}
    total={totalItem}
    onChange={pageChanged}
  />
);

Pager.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalItem: PropTypes.number,
  // fired when user clicks a page number
  pageChanged: PropTypes.func.isRequired,
};

Pager.defaultProps = {
  className: '',
  pageSize: 20,
  totalItem: 0,
  currentPage: 1,
};

export default Pager;
