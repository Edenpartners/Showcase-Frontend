import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import CategoryContext from '../../../context/CategoryContext';

import './Search.css';

const { Option } = Select;
const { Search: SearchFilter } = Input;

class Search extends Component {
  constructor() {
    super();

    this.state = {
      category: null,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(value) {
    this.setState({
      category: value,
    });
  }

  handleSearch(value) {
    const { onSearch } = this.props;
    const { category } = this.state;
    if (typeof onSearch === 'function') {
      onSearch(category, value);
    }
  }

  render() {
    const selectBefore = (
      <CategoryContext.Consumer>
        {({ data }) => (
          <Select defaultValue="All" style={{ backgroundColor: '#e6e6e6' }} onSelect={this.handleCategoryChange} dropdownMatchSelectWidth={false}>
            {
              data.map(category => (
                <Option key={category.name} value={category.name}>
                  {category.name}
                </Option>
              ))
            }
          </Select>
        )}
      </CategoryContext.Consumer>
    );

    return (
      <SearchFilter addonBefore={selectBefore} onSearch={this.handleSearch} placeholder="Search" enterButton id="search-filter" />
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func,
};

Search.defaultProps = {
  onSearch: null,
};

export default Search;
