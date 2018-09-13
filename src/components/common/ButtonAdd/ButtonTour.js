import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

class ButtonTour extends Component {
  render() {
    const { handleCloseTuor } = this.props;
    return (
      <div style={styles.styleDivBg}>
        <button type="button" style={styles.buttonStyle} onClick={handleCloseTuor}>
          <div className="ant-back-top-content">
            <Icon type="question-circle-o" style={styles.styleBtn} />
          </div>
        </button>
      </div>
    );
  }
}
ButtonTour.propTypes = {
  handleCloseTuor: PropTypes.func,
};
ButtonTour.defaultProps = {
  handleCloseTuor: null,
};

const styles = {
  styleDivBg: {
    paddingTop: '70vh',
    paddingLeft: '30px',
    position: 'fixed',
  },
  styleBtn: {
    fontSize: 15,
    paddingTop: '12px',
  },
  buttonStyle: {
    background: 'none',
    border: 'none',
    outline: 'none',
  },
};


export default ButtonTour;
