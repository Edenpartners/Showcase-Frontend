import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, message } from 'antd';
import { Container, Row, Col } from 'reactstrap';
import Tour from 'reactour';
import ProductItem from '../../common/ProductItem/ProductItem';
import Pager from '../../common/Pager/Pager';
import ButtonAdd from '../../common/ButtonAdd/ButtonAdd';
import Offers from '../../../services/Offers';
import Assets from '../../../services/Assets';
import ButtonTour from '../../common/ButtonAdd/ButtonTour';

const registerSample = require('../../../assets/img/register-sample.png');

class ProductManagement extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      isSearching: false,
      currentPage: 1,
      totalItem: 0,
      items: [],
      isTourOpen: false,
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.closeTour = this.closeTour.bind(this);
    this.openTour = this.openTour.bind(this);
  }

  componentDidMount() {
    const { productType, match } = this.props;
    this.fetchData(productType, {
      category: match.params.category !== 'All' ? match.params.category : '',
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      productType, category, name, match,
    } = this.props;
    const params = {
      category: nextProps.category !== 'All' ? nextProps.category : '',
      name: nextProps.name,
    };
    if (nextProps.productType !== productType) {
      this.fetchData(nextProps.productType, params);
    }

    if (category !== nextProps.category || name !== nextProps.name) {
      this.setState({ isSearching: true });
      this.fetchData(productType, params);
    }

    if (nextProps.match.params.category !== match.params.category) {
      this.setState({ isSearching: false });
      this.fetchData(productType, {
        category: nextProps.match.params.category !== 'All' ? nextProps.match.params.category : '',
        name,
      });
    }
  }

  closeTour() {
    this.setState({ isTourOpen: false });
  }

  openTour() {
    document.body.style.overflowY = 'hidden';
    this.setState({ isTourOpen: true });
  }

  fetchData(productType, params = {}, page = 1) {
    this.setState({ isLoading: true }, () => {
      if (productType === 'published') {
        Offers.gitListByCurrentUser(params).then((response) => {
          const totalPage = Math.ceil(
            response.data.meta.total_record / response.data.meta.page_size,
          );
          this.setState({
            items: response.data.results, currentPage: page, isLoading: false, totalPage,
          });
        }).catch(() => {
          message.error('Unable to fetch data from server. Please try again!');
        });
      } else {
        Assets.gitListByCurrentUser(params).then((response) => {
          this.setState({
            items: response.data.results,
            currentPage: page,
            isLoading: false,
            totalItem: response.data.meta.total_record,
          });
        }).catch(() => {
          message.error('Unable to fetch data from server. Please try again!');
        });
      }
    });
  }

  handlePageChanged(page) {
    const {
      productType, category, name, match,
    } = this.props;
    const { isSearching } = this.state;
    let addedParams = {
      category: match.params.category !== 'All' ? match.params.category : '',
    };
    if (isSearching) {
      addedParams = {
        category,
        name,
      };
    }
    this.setState({ currentPage: page }, this.fetchData(productType, addedParams, page));
  }

  renderItems() {
    const { items } = this.state;
    const { productType } = this.props;
    return items.map(tab => (
      <Col key={`${tab.name}-${tab.id}`} md="3" style={styles.itemWrapper}>
        <ProductItem {...this.props} productData={tab} isPublished={productType === 'published'} />
      </Col>
    ));
  }

  render() {
    const {
      currentPage, totalItem, isLoading, isTourOpen,
    } = this.state;
    return (
      <Spin spinning={isLoading} size="large">
        <ButtonTour handleCloseTuor={this.openTour} />
        <Container style={styles.containerStyle} data-tut="tour_registerItem">
          <Row>
            <Col md="3" style={styles.itemWrapper}>
              <ButtonAdd
                routeTo="/account/new-assets"
                label="Add Item"
                heightBg="256px"
              />
            </Col>
            {this.renderItems()}
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
        <Tour
          onRequestClose={this.closeTour}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
        />
      </Spin>
    );
  }
}
const tourConfig = [
  {
    selector: '[data-tut="tour_addItem"]',
    content: 'Try to create your new item',
  },
  {
    selector: '[data-tut="tour_addItem"]',
    content: () => (
      <div>
        <p>
          To sell this item. Please register it to the market
        </p>
        <img className="img" alt="" src={registerSample} />
      </div>
    ),
    position: 'right',
  },
];

ProductManagement.propTypes = {
  productType: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      category: PropTypes.string,
    }),
  }),
};

ProductManagement.defaultProps = {
  productType: 'published',
  category: '',
  name: '',
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
    marginTop: 20,
    minHeight: 'calc(100vh - 234px)',
  },
};

export default ProductManagement;
