import React, { Component } from 'react';
import { BackTop } from 'antd';


class ScrollButton extends Component {
  render() {
    return (
      <div>
        <BackTop style={styles} visibilityHeight={200} />
      </div>
    );
  }
}
const styles = {
  marginBottom: '40px',
  marginRight: '-40px',
};

export default ScrollButton;
