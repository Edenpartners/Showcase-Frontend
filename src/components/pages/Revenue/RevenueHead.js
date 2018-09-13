import React, { Component } from 'react';
import styled from 'styled-components';

class RevenueHead extends Component {
  render() {
    return (
      <ContainerDiv>
        <div className="pull-left" style={styles.datetimeStyle}>
          {/*01 July 2018*/}
        </div>
        <div className="pull-right" style={styles.statStyle}>
          <div className="pull-left" style={styles.statBlockStyle}>
            <span style={styles.titleStyle}>
              IN
            </span>
            <span style={styles.numberStyle}>
              {this.props.activitiesInfo.totalIn}
            </span>
          </div>
          <div className="pull-left" style={styles.statBlockStyle}>
            <span style={styles.titleStyle}>
              OUT
            </span>
            <span style={styles.numberStyle}>
              {this.props.activitiesInfo.totalOut}
            </span>
          </div>
        </div>
      </ContainerDiv>
    );
  }
}


const ContainerDiv = styled.div`
  background-color: #ffffff;
  height: 70px;
  border-left: 1px solid #dee2e6;
  padding-left: 33px;
  padding-top: 21px;
`;

const styles = {
  titleStyle: {
    fontSize: 14,
    color: '#637097',
  },
  numberStyle: {
    fontSize: 22,
    color: '#010228',
    marginLeft: 8,
  },
  datetimeStyle: {
    color: '#010228',
    fontSize: 20,
    width: '65%',
  },
  statStyle: {
    width: '35%',
  },
  statBlockStyle: {
    width: '50%',
  },
};

export default RevenueHead;
