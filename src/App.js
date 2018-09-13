import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import {
  HashRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import './App.css';
import history from './services/History';
import Layout from './components/common/Layout/Layout';
import AuthenLayout from './components/common/Layout/AuthenLayout';
import LayoutBreadCum from './components/common/Layout/LayoutBreadCum';
import Common from './services/Common';
import updateBreadCrumb from './actions';
import BreadCrumbs from './services/BreadCrumbs';
import FilterHeaderContext from './context/FilterHeaderContext';
import UserContext from './context/UserContext';
import CategoryContext from './context/CategoryContext';
import PrivateRoute from './components/common/Route/PrivateRoute';
import { getRequest } from './services/axiosApi';
import { API_ROOT } from './config';
import Authentication from './services/Authentication';
import Categories from './services/Categories';


class App extends Component {
  constructor() {
    super();

    this.state = {
      showFilterHead: false,
      userInfo: {},
      categories: [],
      categoryPrefix: '',
    };
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
  }

  componentDidMount() {
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange);
    this.handleLocationChange(history.location);

    if (Authentication.isAuthenticated()) {
      this.fetchUserInfo();
    }
    // Get category list
    Categories.getList().then((response) => {
      let categories = response.data;
      categories = [{ name: 'All' }, ...categories];
      this.setState({ categories });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  fetchUserInfo() {
    const api = getRequest(`${API_ROOT}/accounts`);
    api.then((response) => {
      this.setState({ userInfo: response });
    }).catch(() => {
      message.error('Unable to fetch user data.');
    });
  }

  handleUserUpdate() {
    this.fetchUserInfo();
  }

  handleLocationChange(location) {
    const { dispatch } = this.props;
    const { showFilterHead, categoryPrefix } = this.state;
    Common.setTitle(location.hash);

    if (showFilterHead !== Common.shouldShowFilterHead(location.hash)
      || categoryPrefix !== Common.getCategoryPrefix(location.hash)) {
      this.setState({
        showFilterHead: Common.shouldShowFilterHead(location.hash),
        categoryPrefix: Common.getCategoryPrefix(location.hash),
      });
    }
    dispatch(
      updateBreadCrumb(
        BreadCrumbs[location.hash] || BreadCrumbs[Common.getBaseHash(location.hash)] || [],
      ),
    );
  }

  render() {
    const {
      showFilterHead, userInfo, categories, categoryPrefix,
    } = this.state;
    return (
      <HashRouter history={history}>
        <UserContext.Provider value={{ user: userInfo, handleUserUpdate: this.handleUserUpdate }}>
          <CategoryContext.Provider value={{ data: categories, prefix: categoryPrefix }}>
            <Switch>
              <Route exact path="/" render={() => (<Redirect to="/authentication/sign-in" />)} />
              <PrivateRoute path="/store" component={Layout} />
              <Route path="/authentication" component={AuthenLayout} />
              <FilterHeaderContext.Provider value={{ showFilter: showFilterHead }}>
                <PrivateRoute path="/account" component={LayoutBreadCum} />
              </FilterHeaderContext.Provider>
            </Switch>
          </CategoryContext.Provider>
        </UserContext.Provider>
      </HashRouter>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
};

App.defaultProps = {
  dispatch: () => {},
};

export default connect()(App);
