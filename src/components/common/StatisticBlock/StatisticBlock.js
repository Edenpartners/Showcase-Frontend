import React, { Component } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import UserContext from '../../../context/UserContext';

class StatisticBlock extends Component {
  render() {
    const {
      title, subTitle, containerStyles, showExtraBtn, onChargeConfirmed,
    } = this.props;
    const combinedStyles = Object.assign({}, styles.containerStyle, containerStyles);
    const chargeConfirmationText = 'Are you sure to charge EDN?';
    const chargeTooltip = (
      <p>
        Let&apos;s charge to get 1000 EDN
        <br />
        free now!
      </p>
    );
    return (
      <div style={combinedStyles}>
        <h3 style={styles.titleStyle}>
          {title}
        </h3>
        <p style={styles.subTitleStyle}>
          {subTitle}
        </p>
        {showExtraBtn && (
          <UserContext.Consumer>
            {({ user }) => {
              if (user.chargeable) {
                return (
                  <Popconfirm placement="topLeft" title={chargeConfirmationText} onConfirm={onChargeConfirmed} okText="Yes" cancelText="No">
                    <Tooltip placement="topRight" title={chargeTooltip}>
                      <button type="button" style={styles.extraBtnStyle} data-tut="tour_charge">
                        Charge EDN
                      </button>
                    </Tooltip>
                  </Popconfirm>
                );
              }
              return null;
            }}
          </UserContext.Consumer>
        )}
      </div>
    );
  }
}

StatisticBlock.propTypes = {
  containerStyles: PropTypes.shape({
    backgroundColor: PropTypes.string,
    boxShadow: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  showExtraBtn: PropTypes.bool,
  onChargeConfirmed: PropTypes.func,
};

StatisticBlock.defaultProps = {
  containerStyles: {
    backgroundColor: '#ff8976',
    boxShadow: 'none',
  },
  showExtraBtn: false,
  onChargeConfirmed: null,
};

const styles = {
  containerStyle: {
    height: 160,
    borderRadius: 4,
    paddingTop: 30,
    paddingLeft: 40,
  },
  titleStyle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0,
  },
  subTitleStyle: {
    fontSize: 22,
    color: '#ffffff',
  },
  extraBtnStyle: {
    position: 'absolute',
    right: 45,
    bottom: 35,
    borderRadius: 2,
    border: 'solid 1px #ffffff',
    background: 'none',
    width: 129,
    height: 36,
    color: '#ffffff',
    fontSize: 14,
  },
};

export default StatisticBlock;
