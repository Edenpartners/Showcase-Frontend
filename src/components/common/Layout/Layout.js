import React, { Component } from 'react';
import {
  Route,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Header from '../Header/Header';
import './Layout.css';
import Home from '../../pages/Home/Home';
import Footer from '../Footer/Footer';
import ActivityNotification from '../../pages/ActivityNotification/ActivityNotification';

import ProductDetail from '../../pages/Product/ProductDetail';
import ViewMember from '../../pages/ViewMember/ViewMember';
import ScrollButton from '../ScollButton/ScollButton';
import TransactionDetails from '../../pages/TransactionDetails/TransactionDetails';
import UserContext from '../../../context/UserContext';

class Layout extends Component {
  constructor() {
    super();

    this.state = {
      category: null,
      name: null,
    };

    this.handleItemSearch = this.handleItemSearch.bind(this);
    this.handleCategoryChanged = this.handleCategoryChanged.bind(this);
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
    const { category, name } = this.state;
    const { match } = this.props;
    return (
      <div>
        <Wrapper>
          <Header
            handleSearch={this.handleItemSearch}
            onCategoryChanged={this.handleCategoryChanged}
          />
          <div className="content-box">
            <Route path={`${match.url}/offers/:category`} render={props => (<Home {...props} category={category} name={name} />)} />
            <Route path={`${match.url}/activity-notification`} component={ActivityNotification} />
            <UserContext.Consumer>
              {({ handleUserUpdate, user }) => (
                <div>
                  <Route path={`${match.url}/product-detail`} render={props => (<ProductDetail {...props} handleUserUpdate={handleUserUpdate} userInfo={user} category={category} name={name} />)} />
                  <Route path={`${match.url}/view-member/:owner`} render={props => (<ViewMember {...props} handleUserUpdate={handleUserUpdate} userInfo={user} />)} />
                  <Route path={`${match.url}/transaction-details/:id`} render={props => (<TransactionDetails {...props} handleUserUpdate={handleUserUpdate} userInfo={user} />)} />
                </div>
              )}
            </UserContext.Consumer>
          </div>
          <ScrollButton />
          <Footer />
        </Wrapper>
      </div>
    );
  }
}

Layout.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
};

Layout.defaultProps = {
  match: {
    url: null,
  },
};

const Wrapper = styled.div`
  background-color: #ebebeb;
  min-height: 100vh;
`;

export default Layout;
