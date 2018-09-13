import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ButtonAdd extends Component {
  render() {
    const {
      routeTo, widthBg, heightBg, label,
    } = this.props;
    const containerStyle = Object.assign({},
      styles.alignFlex, { width: widthBg, height: heightBg });
    return (
      <div style={styles.btnAddImage}>
        <div style={containerStyle} data-tut="tour_addItem">
          <Link to={routeTo}>
            <button type="button" style={styles.buttonStyle}>
              <span className="fa-stack fa-2x" style={styles.plusBtnStyle}>
                <i className="fa fa-circle fa-stack-2x" style={styles.circleBtn} />
                <i className="fa fa-plus fa-stack-1x" style={styles.circleBtnInline} />
              </span>
              <p style={styles.titleStyle}>
                {label}
              </p>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
ButtonAdd.propTypes = {
  routeTo: PropTypes.string,
  label: PropTypes.string,
  widthBg: PropTypes.string,
  heightBg: PropTypes.string,
};
ButtonAdd.defaultProps = {
  label: 'Add Image',
  widthBg: '100%',
  heightBg: '100%',
  routeTo: '',
};

const styles = {
  btnAddImage: {
    background: '#53535c',
    textAlign: 'center',
  },
  buttonStyle: {
    background: 'none',
    border: 'none',
  },
  alignFlex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  plusBtnStyle: {
    fontSize: '4em',
  },
  titleStyle: {
    color: '#ffffff',
    fontSize: 16,
  },
  alignVertical: {
    top: '50%',
  },
  circleBtn: {
    color: '#5bb7e4',
  },
  circleBtnInline: {
    color: 'white',
  },
};
export default ButtonAdd;
