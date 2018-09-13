import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import CategoryContext from '../../../context/CategoryContext';
import Common from '../../../services/Common';

class Category extends Component {
  constructor() {
    super();

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(category) {
    const { onCategoryChanged } = this.props;
    if (typeof onCategoryChanged === 'function') {
      onCategoryChanged(category);
    }
  }

  render() {
    return (
      <CategoryContext.Consumer>
        {({ data, prefix }) => (
          data.map((category, index) => (
            <div className="pull-left" key={category.name}>
              <NavLink to={`${prefix}${category.name}`} activeStyle={styles.linkActiveStyle} style={styles.linkStyle} onClick={() => this.handleCategoryChange(category.name)}>
                <span key={`category-${category.name}`} style={styles.nameStyle}>
                  { Common.shortenString(category.name, 35) }
                </span>
              </NavLink>
              { data.length > index + 1 && (
                <span style={styles.dividerStyle}>
                  |
                </span>
              )
              }
            </div>
          ))
        )}
      </CategoryContext.Consumer>
    );
  }
}

Category.propTypes = {
  onCategoryChanged: PropTypes.func,
};

Category.defaultProps = {
  onCategoryChanged: null,
};

const styles = {
  linkStyle: {
    color: '#ffffff',
  },
  nameStyle: {
    paddingRight: 12,
    fontSize: 14,
  },
  dividerStyle: {
    paddingRight: 12,
    fontSize: 14,
    color: '#ffffff',
  },
  linkActiveStyle: {
    color: '#ffffff',
    fontWeight: 600,
  },
};

export default Category;
