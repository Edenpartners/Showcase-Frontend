import React, { Component } from 'react';
import { Spin, message } from 'antd';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import ProductItem from '../../common/ProductItem/ProductItem';
import FilterGroup from '../../common/FilterGroup/FilterGroup';
import Pager from '../../common/Pager/Pager';
import Offers from '../../../services/Offers';
import SmoothScroll from '../../../services/SmoothScroll';
import NoDataTable from '../../common/NoDataTable/NoDataTable';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      noItem: false,
      isSearching: false,
      isLoading: false,
      currentPage: 1,
      totalItem: 0,
      items: [],
      queryParams: {
        fromDate: null,
        toDate: null,
        status: '',
      },
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    const { match, name } = this.props;
    if (name) {
      this.setState({ isSearching: true });
    }
    this.fetchData({
      category: match.params.category !== 'All' ? match.params.category : '',
      name,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      category, name, history, match,
    } = this.props;
    if (category !== nextProps.category || name !== nextProps.name) {
      const nextCategory = nextProps.category ? nextProps.category : 'All';
      if (nextCategory !== match.params.category) {
        history.push(`/store/offers/${nextCategory}`);
      }
      this.setState({ isSearching: true });
      this.fetchData({
        category: nextProps.category !== 'All' ? nextProps.category : '',
        name: nextProps.name,
      });
    }

    if (nextProps.match.params.category !== match.params.category) {
      this.setState({ isSearching: false });
      this.fetchData({
        category: nextProps.match.params.category !== 'All' ? nextProps.match.params.category : '',
        name,
      });
    }
  }

  /**
   * Fetch data from server
   * @param queryParams
   * @param page
   */
  fetchData(queryParams = {}, page = 1) {
    this.setState({ isLoading: true }, () => {
      Offers.getList(queryParams, page).then((response) => {
        this.setState({
          items: response.data.results,
          currentPage: page,
          totalItem: response.data.meta.total_record,
          isLoading: false,
          noItem: response.data.results.length === 0,
        });
      }).catch(() => {
        message.error('Unable to fetch data from server. Please try again!');
      });
    });
  }

  /**
   * Handle page changed
   * @param page
   */
  handlePageChanged(page) {
    SmoothScroll.scrollTo('search-filter');
    const { category, name, match } = this.props;
    const { queryParams, isSearching } = this.state;
    let addedParams = {
      category: match.params.category !== 'All' ? match.params.category : '',
    };
    if (isSearching) {
      addedParams = { category, name };
    }
    const newParams = Object.assign({}, queryParams, addedParams);
    this.setState({ currentPage: page }, this.fetchData(newParams, page));
  }

  handleDateChange(dates) {
    const { category, name, match } = this.props;
    const { queryParams, isSearching } = this.state;
    let addedParams = {
      category: match.params.category !== 'All' ? match.params.category : '',
    };
    if (isSearching) {
      addedParams = {
        category,
        name,
      };
    }
    const newQuery = Object.assign({}, queryParams, {
      fromDate: dates && typeof dates[0] !== 'undefined' ? dates[0].format('DD/MM/YYYY') : '',
      toDate: dates && typeof dates[1] !== 'undefined' ? dates[1].format('DD/MM/YYYY') : '',
    });

    const newParams = Object.assign({}, newQuery, addedParams);
    this.setState({ queryParams: newQuery }, this.fetchData(newParams));
  }

  handleStatusChange(status) {
    const { queryParams } = this.state;
    const newParams = Object.assign({}, queryParams, { status });
    this.setState({ queryParams: newParams }, this.fetchData(newParams));
  }

  renderItems() {
    const { items } = this.state;
    return items.map(item => (
      <Col key={`${item.name}-${item.id}`} md="3" style={styles.itemWrapper}>
        <ProductItem productData={item} isPublished showAvatar />
      </Col>
    ));
  }

  render() {
    const {
      currentPage, totalItem, isLoading, noItem,
    } = this.state;
    return (
      <div>
        <FilterGroup
          onDateChange={this.handleDateChange}
          onStatusChange={this.handleStatusChange}
        />
        <Spin spinning={isLoading} size="large">
          <Container style={styles.containerStyle}>
            <Row>
              {!noItem && (
                this.renderItems()
              )}
              {noItem && (
                <Col md="12" style={{ minHeight: 'calc(100vh - 400px)' }}>
                  <NoDataTable message="There is no item" />
                </Col>
              )}
            </Row>
            <Row>
              <Col md="12">
                <Pager
                  className="pull-right"
                  pageChanged={this.handlePageChanged}
                  currentPage={currentPage}
                  totalItem={totalItem}
                />
              </Col>
            </Row>
          </Container>
        </Spin>
      </div>
    );
  }
}

Home.propTypes = {
  category: PropTypes.string,
  name: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      category: PropTypes.string,
    }),
  }),
};

Home.defaultProps = {
  category: '',
  name: '',
  history: {
    push: null,
  },
  match: {
    params: {
      category: null,
    },
  },
};

const styles = {
  itemWrapper: {
    marginBottom: 25,
  },
  containerStyle: {
    minHeight: 'calc(100vh - 244px)',
  },
};

export default Home;
