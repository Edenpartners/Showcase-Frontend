import React, { Component } from 'react';
import {
  Route,
} from 'react-router-dom';
import styled from 'styled-components';
import './Layout.css';
import Footer from '../Footer/Footer';
import ProductManagement from '../../pages/ProductManagement/ProductManagement';
import HeaderBreadCum from '../Header/HeaderBreadCum';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Revenue from '../../pages/Revenue/Revenue';
import MyProfile from '../../pages/authentication/MyProfile';
import TransactionList from '../../pages/TransactionList/TransactionList';
import MessageBox from '../../pages/MessageBox/MessageBox';
import FilterHeaderContext from '../../../context/FilterHeaderContext';
import UserContext from '../../../context/UserContext';
import ScrollButton from '../ScollButton/ScollButton';
import CreateProduct from '../../pages/Product/CreateProduct';

class LayoutBreadCum extends Component {
  constructor() {
    super();

    this.state = {
      productType: 'pending',
      category: null,
      name: null,
    };

    this.handleTypeFilterChange = this.handleTypeFilterChange.bind(this);
    this.handleItemSearch = this.handleItemSearch.bind(this);
    this.handleCategoryChanged = this.handleCategoryChanged.bind(this);
  }

  handleTypeFilterChange(value) {
    this.setState({ productType: value });
  }

  handleItemSearch(category, name) {
    this.setState({
      category, name,
    });
  }

  handleCategoryChanged(category) {
    // Clear search value
    document.getElementById('search-filter').value = '';
    const { name } = this.state;
    if (name) {
      this.setState({
        category,
        name: '',
      });
    }
  }

  render() {
    const { match } = this.props;
    const { productType, category, name } = this.state;
    return (
      <div>
        <Wrapper>
          <FilterHeaderContext.Consumer>
            {setting => (
              <HeaderBreadCum
                showFilter={setting.showFilter}
                onTypeChange={this.handleTypeFilterChange}
                handleSearch={this.handleItemSearch}
                onCategoryChanged={this.handleCategoryChanged}
              />)}
          </FilterHeaderContext.Consumer>
          <div className="content-box">
            <Route
              path={`${match.url}/product-management/:category`}
              render={
                props => (
                  <ProductManagement
                    {...props}
                    productType={productType}
                    category={category}
                    name={name}
                  />
                )
              }
            />
            <Route path={`${match.url}/dashboard`} component={Dashboard} />
            <UserContext.Consumer>
              {({ handleUserUpdate }) => (
                <div>
                  <Route path={`${match.url}/revenue`} render={props => (<Revenue {...props} handleUserUpdate={handleUserUpdate} />)} />
                  <Route path={`${match.url}/my-profile`} render={props => (<MyProfile {...props} handleUserUpdate={handleUserUpdate} />)} />
                  <Route path={`${match.url}/message-box/:memberId`} render={props => (<MessageBox {...props} handleUserUpdate={handleUserUpdate} />)} />
                </div>
              )}
            </UserContext.Consumer>
            <Route path={`${match.url}/transactions`} component={TransactionList} />
            <Route path={`${match.url}/new-assets`} component={CreateProduct} />
            <Route path={`${match.url}/view-assets`} component={CreateProduct} />
          </div>
          <ScrollButton />
          <Footer />
        </Wrapper>
      </div>
    );
  }
}

const Wrapper = styled.div`
  background-color: #ebebeb;
  min-height: 100vh;
`;

export default LayoutBreadCum;
