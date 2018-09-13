import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NoDataTable = ({ message }) => (
  <NoItemDiv>
    <h5 style={{ color: 'gray' }}>
      {message}
    </h5>
  </NoItemDiv>
);

NoDataTable.propTypes = {
  message: PropTypes.string,
};

NoDataTable.defaultProps = {
  message: null,
};

const NoItemDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export default NoDataTable;
