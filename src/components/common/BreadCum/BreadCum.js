import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class BreadCum extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { breadcrumb } = this.props;
    const { nameStyle, dividerStyle } = styles;
    const nameBlurStyle = Object.assign({}, nameStyle, { color: '#00bfc2' });
    return breadcrumb.map((item, index) => (
      <div className="pull-left" key={item.id}>
        <Link to={item.url}>
          <span key={`breadcum-${item.id}`} style={breadcrumb.length > index + 1 ? nameBlurStyle : nameStyle}>
            { item.name }
          </span>
        </Link>
        { breadcrumb.length > index + 1 && (
          <span style={dividerStyle}>
            &gt;
          </span>
        )
        }
      </div>
    ));
  }
}

BreadCum.propTypes = {
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
};

BreadCum.defaultProps = {
  breadcrumb: [],
};

const styles = {
  nameStyle: {
    paddingRight: 8,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'normal',
  },
  dividerStyle: {
    paddingRight: 8,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'normal',
  },
};

const mapStateToProps = state => ({
  breadcrumb: state.breadcrumb,
});

export default connect(mapStateToProps)(BreadCum);
