import React, { Component } from 'react';
import {
  Container, Row, Col,
} from 'reactstrap';
import { Spin, message } from 'antd';
import PropTypes from 'prop-types';
import ProductItem from '../../common/ProductItem/ProductItem';
import Pager from '../../common/Pager/Pager';
import ViewMemberInfo from './ViewMemberInfo';
import { getRequest } from '../../../services/axiosApi';
import { API_ROOT } from '../../../config';
import warningMessage from '../../common/WarningMessage/warningMessage';
import Offers from '../../../services/Offers';

class ViewMember extends Component {
  constructor() {
    super();

    // noinspection JSAnnotator
    this.state = {
      currentPage: 1,
      totalItem: 0,
      items: [],
      isLoading: false,
      showChatButton: true,
      showAddFrButton: true,
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.checkFriend = this.checkFriend.bind(this);
    this.updateUserInfoCallback = this.updateUserInfoCallback.bind(this);
  }

  componentDidMount() {
    const { owner } = this.props.match.params;
    let { userInfo } = this.props;
    if (!userInfo || !userInfo.publicKey) {
      const api = getRequest(`${API_ROOT}/accounts`);
      api.then((response) => {
        this.setState({
          showChatButton: response.publicKey !== owner,
          showAddFrButton: response.publicKey !== owner,
        });
        userInfo = response;
        this.checkFriend(userInfo, owner);
      }).catch(() => {
        warningMessage(false, 'Unable to fetch data from server. Please try again!');
      });
    } else if (userInfo.publicKey === owner) {
      this.setState({
        showChatButton: false,
        showAddFrButton: false,
      });
    } else {
      this.checkFriend(userInfo, owner);
    }


    const { currentPage } = this.state;
    this.setState({
      isLoading: true,
    }, () => {
      const apiGetListItem = getRequest(`${API_ROOT}/offers?index=${currentPage}&page_size=20&owner=${owner}`);
      apiGetListItem.then((response) => {
        this.setState({
          items: response.results,
          totalItem: response.meta.total_record,
          isLoading: false,
        });
      }).catch(() => {
        warningMessage(false, 'Unable to fetch data from server. Please try again!', 3);
      });
    });
  }

  updateUserInfoCallback() {
    const { handleUserUpdate } = this.props;
    if (typeof handleUserUpdate === 'function') {
      handleUserUpdate();
    }
    this.setState({
      showChatButton: true,
      showAddFrButton: false,
    });
  }

  fetchData(params = {}, page = 1) {
    const { owner } = this.props.match.params;
    this.setState({ isLoading: true }, () => {
      Offers.getListOwnerOffer(owner, page, 20, params).then((response) => {
        this.setState({
          items: response.data.results,
          currentPage: page,
          totalItem: response.data.meta.total_record,
          isLoading: false,
        });
      }).catch(() => {
        message.error('Unable to fetch data from server. Please try again!');
      });
    });
  }

  /**
   * Fetch data from server
   * @param queryParams
   * @param page
   */
  /**
   * Handle page changed
   * @param page
   */
  handlePageChanged(page) {
    const { queryParams } = this.state;
    this.setState({ currentPage: page }, this.fetchData(queryParams, page));
  }

  checkFriend(userInfo, ownerId) {
    if (userInfo.friend_list.includes(ownerId)) {
      this.setState({
        showChatButton: true,
        showAddFrButton: false,
      });
    } else if (userInfo.publicKey === ownerId) {
      this.setState({
        showChatButton: false,
        showAddFrButton: false,
      });
    } else {
      this.setState({
        showChatButton: false,
        showAddFrButton: true,
      });
    }
  }

  renderItems() {
    const { items } = this.state;
    return items.map(item => (
      <Col key={item.id} md="3" style={styles.itemWrapper}>
        <ProductItem productData={item} isPublished />
      </Col>
    ));
  }

  render() {
    const {
      currentPage, totalItem, isLoading, showAddFrButton, showChatButton,
    } = this.state;
    const { owner } = this.props.match.params;
    return (
      <div>
        <Container style={styles.containerStyle}>
          <div className="pt-5 pb-5">
            <Col md="12">
              <ViewMemberInfo
                ownerPublicKey={owner}
                showAddFrButton={showAddFrButton}
                showChatButton={showChatButton}
                updateUserInfoCallback={this.updateUserInfoCallback}
              />
            </Col>
          </div>
          <Spin spinning={isLoading} size="large">
            <Row>
              {this.renderItems()}
            </Row>
          </Spin>
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
      </div>
    );
  }
}

ViewMember.propTypes = {
  handleUserUpdate: PropTypes.func,
  category: PropTypes.string,
  name: PropTypes.string,
};

ViewMember.defaultProps = {
  handleUserUpdate: null,
  category: '',
  name: '',
};


const styles = {
  itemWrapper: {
    marginBottom: 25,
  },
  containerStyle: {
    minHeight: 'calc(100vh - 144px)',
  },
};

export default ViewMember;
