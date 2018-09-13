import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button, Popconfirm, Spin } from 'antd';
import PropTypes from 'prop-types';
import { styles } from './StyleProductDetail';
import { BuyItemModal } from './BuyItemModal';
import { API_ROOT } from '../../../config';
import { getRequest, patchRequest, postRequest } from '../../../services/axiosApi';
import { CommentBox } from './CommentBox';
import {
  BUY_ITEM_SIDE_EFFECT_MESSAGES,
  MESSAGE_ERROR_CONNECT_TO_SERVER,
  REPEATABLE_OPTION_DISPLAY_MESSAGES,
  TYPE_ERRORS_RESPONSE_WHEN_BUY_ITEM,
  TYPE_MESSAGES
} from '../../common/const/Messages';
import { message } from 'antd';
import styled from 'styled-components';
import { DynamicProductBreadCrumb } from '../DynamicBreadCrumb/DynamicProductBreadCrumb';
import Common from '../../../services/Common';
import ButtonTour from '../../common/ButtonAdd/ButtonTour';
import Tour from 'reactour';
import Account from '../../../services/Account';
import warningMessage from '../../common/WarningMessage/warningMessage';
import { Link } from 'react-router-dom';

const avatarDefault = require('../../../assets/img/user.png');
const imageDefault = '';


class ProductDetail extends React.Component {

  showModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  onCancel = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  displayErrorMessage = (message) => {
    let errorResponse = message.toUpperCase();
    if (errorResponse.includes(TYPE_ERRORS_RESPONSE_WHEN_BUY_ITEM.ERROR_EXCHANGE_ONCE_PER_ACCOUNT)) {
      this.messagesBuyItem(TYPE_MESSAGES.EXCHANGE_ONCE_PER_ACCOUNT);
    }
    if (errorResponse.includes(TYPE_ERRORS_RESPONSE_WHEN_BUY_ITEM.ERROR_EXCHANGE_ONE)) {
      this.messagesBuyItem(TYPE_MESSAGES.EXCHANGE_ONCE);
    }
    if (errorResponse.includes(TYPE_ERRORS_RESPONSE_WHEN_BUY_ITEM.ERROR_EXCHANGE_NOT_ENOUGH_QUANTITY)) {
      this.messagesBuyItem(TYPE_MESSAGES.EXCHANGE_NOT_ENOUGH_QUANTITY);
    }
    if (errorResponse.includes(TYPE_ERRORS_RESPONSE_WHEN_BUY_ITEM.ERROR_NOT_ENOUGH_MONEY)) {
      this.messagesBuyItem(TYPE_MESSAGES.NOT_ENOUGH_MONEY);
    }
    if (errorResponse === TYPE_ERRORS_RESPONSE_WHEN_BUY_ITEM.ERROR_CONNECT_SERVER) {
      this.messagesBuyItem(MESSAGE_ERROR_CONNECT_TO_SERVER);
    }
  };
  messagesBuyItem = (type) => {
    switch (type) {
      case TYPE_MESSAGES.SUCCESS:
        message.success(BUY_ITEM_SIDE_EFFECT_MESSAGES.MESSAGE_BUY_ITEM_SUCCESS, 3);
        break;
      case TYPE_MESSAGES.FAILED:
        message.error(BUY_ITEM_SIDE_EFFECT_MESSAGES.MESSAGE_BUY_ITEM_FAILED, 3);
        break;
      case TYPE_MESSAGES.NOT_ENOUGH_MONEY:
        message.error(BUY_ITEM_SIDE_EFFECT_MESSAGES.MESSAGE_NOT_ENOUGH_MONEY);
        break;
      case TYPE_MESSAGES.EXCHANGE_ONCE_PER_ACCOUNT:
        message.error(BUY_ITEM_SIDE_EFFECT_MESSAGES.MESSAGE_EXCHANGE_ONCE_PER_ACCOUNT);
        break;
      case TYPE_MESSAGES.EXCHANGE_ONCE:
        message.error(BUY_ITEM_SIDE_EFFECT_MESSAGES.MESSAGE_EXCHANGE_ONCE);
        break;
      case TYPE_MESSAGES.EXCHANGE_NOT_ENOUGH_QUANTITY:
        message.error(BUY_ITEM_SIDE_EFFECT_MESSAGES.MESSAGE_EXCHANGE_NOT_ENOUGH_QUANTITY);
        break;
      default:
        break;
    }
  };
  onBuyItem = () => {
    const { handleUserUpdate } = this.props;
    // call api buy item
    let apiBuyItem = patchRequest(JSON.stringify({ count: 1 }), `offers/${this.state.id}/accept`);
    apiBuyItem.then(() => {
      this.messagesBuyItem(TYPE_MESSAGES.SUCCESS);
      if (typeof handleUserUpdate === 'function') {
        handleUserUpdate();
      }
      this.setState({
        visible: !this.state.visible,
      });
    })
      .catch(error => {
        const errorResponse = error.response ? error.response.data.error : TYPE_MESSAGES.FAILED;
        this.displayErrorMessage(errorResponse);
      });
  };
  onChangeComment = (e) => {
    this.setState({
      textComment: e.target.value,
      isError: false,
    });

  };
  onChangePageSize = (index) => {
    let pageSize = this.state.pagination.pageSize;
    let apiComment = getRequest(`${API_ROOT}/comments`, `${this.state.id}?index=${index}&page_size=${pageSize}`);
    apiComment.then(response => {
      let commentList = response.results;
      let meta = response.meta;
      this.setState({
        comments: commentList.reverse(),
        pagination: {
          index: meta.index,
          pageSize: meta.page_size,
          totalRecords: meta.total_record,
        }
      });
    });
  };
  onSubmitComment = () => {
    // validate form comment
    const content = this.state.textComment.trim();
    let result = this.checkIsError(content);

    if (!result) {
      //initial comment object after validate form
      const comment = {
        itemId: this.state.id,
        content: content
      };

      // call api to post this comment
      let api = postRequest(JSON.stringify(comment), 'comments');
      const index = this.state.pagination.index;
      const pageSize = this.state.pagination.pageSize;
      api.then(() => {
        this.setState({
          textComment: '',
        });
        // call api list comments again to refresh the list
        let apiComment = getRequest(`${API_ROOT}/comments`, `${this.state.id}?index=${index}&page_size=${pageSize}`);
        apiComment.then(response => {
          let commentList = response.results;
          let meta = response.meta;
          this.setState({
            comments: commentList.reverse(),
            pagination: {
              index: meta.index,
              pageSize: meta.page_size,
              totalRecords: meta.total_record,
            }
          });
        });
      })
        .catch(() => {
          message.error(MESSAGE_ERROR_CONNECT_TO_SERVER);
        });
    }
    else {
      this.setState({
        isError: true
      });
    }
  };
  checkIsError = (value) => {
    return value.trim() === '';
  };
  formatRepeatableOption = (type) => {
    switch (type) {
      case TYPE_MESSAGES.EXCHANGE_ONCE:
        return REPEATABLE_OPTION_DISPLAY_MESSAGES.EXCHANGE_ONE;
      case TYPE_MESSAGES.EXCHANGE_ONCE_PER_ACCOUNT:
        return REPEATABLE_OPTION_DISPLAY_MESSAGES.EXCHANGE_ONCE_PER_ACCOUNT;
      case TYPE_MESSAGES.EXCHANGE_LIMITED_TO_ACCOUNTS:
        return REPEATABLE_OPTION_DISPLAY_MESSAGES.EXCHANGE_LIMITED_TO_ACCOUNTS;
      default:
        break;
    }
  };

  constructor() {
    super();
    this.state = {
      id: '',
      publicKey: '',
      ownerId: '',
      visible: false,
      productItem: {},
      comments: [],
      comment: {},
      textComment: '',
      isError: false,
      price: 0,
      pagination: {
        index: 1,
        pageSize: 10,
        totalRecords: 0,
      },
      isLoadingComment: false,
      isLoading: false,
      isDisplayBuyButton: true,
      isTourOpen: false,
      showChatButton: true,
      showAddFrButton: true,
    };
    this.closeTour = this.closeTour.bind(this);
    this.openTour = this.openTour.bind(this);
  }

  componentDidMount() {
    const id = window.location.href.split('/')
      .pop();
    this.setState({
      id: id,
      isLoadingComment: true,
      isLoading: !this.state.isLoading
    });
    //call api get product id
    let api = getRequest(`${API_ROOT}/offers`, id + '/details');
    api.then(response => {
      //get publicKey and ownerId
      let publicKey = response.account ? response.account.publicKey : '';
      let ownerId = response.owners.length > 0 ? response.owners[0] : '';
      this.setState({
        isLoading: false,
        productItem: response,
        price: response.price,
        publicKey: publicKey,
        ownerId: ownerId,
      },()=>{
        const apiGetPublicKey = getRequest(`${API_ROOT}/accounts`);
        apiGetPublicKey.then((response) => {
          this.setState({ isDisplayBuyButton: response.publicKey !==  publicKey});
        });
      });
      this.getInputInformation(response.account.publicKey);
    }).catch(() => {
      warningMessage(false, 'Unable to fetch data from server. Please try again!', 3);
    });;

    //get api for comment list by product id
    let apiComment = getRequest(`${API_ROOT}/comments`, id);
    apiComment.then(response => {
      let result = response.results;
      let meta = response.meta;
      this.setState({
        comments: result.reverse(),
        isLoadingComment: false,
        textComment: '',
        pagination: {
          index: meta.index,
          pageSize: meta.page_size,
          totalRecords: meta.total_record
        }
      });
    });
  }
  closeTour() {
    this.setState({ isTourOpen: false });
  }

  openTour() {
    document.body.style.overflowY = 'hidden';
    this.setState({ isTourOpen: true });
  }

  componentWillReceiveProps(nextProps) {
    const { history } = this.props;

    if (nextProps.category || nextProps.name) {
      history.push(`/store/offers/${nextProps.category ? nextProps.category : 'All'}`)
    }
  }

  addFriend = () => {
    const { handleUserUpdate } = this.props;
    const addFriendApi = Account.addFriend(this.state.productItem.account.publicKey);
    addFriendApi.then(() => {
      warningMessage(true, 'Success');
      this.setState({
        showChatButton: true,
        showAddFrButton: false,
      });
      if (typeof handleUserUpdate === 'function') {
        handleUserUpdate();
      }
    }).catch((response) => {
      if (response.response.data.error.includes('FRIEND_SHIP_EXISTING')) {
        warningMessage(false, 'Friend is existing', 3);
      } else if (response.response.data.error.includes('Cannot add your own account')){
        warningMessage(false, 'Cannot add your own account!', 3);
      } else {
        warningMessage(false, 'Oh something went wrong !! please try again later !!', 3);
      }
    });
  };

  getInputInformation(owner){
    let { userInfo } = this.props;
    if (!userInfo || !userInfo.publicKey) {
      const api = getRequest(`${API_ROOT}/accounts`);
      api.then((response) => {
        this.setState({
          showChatButton: response.publicKey !== owner,
          showAddFrButton: response.publicKey !== owner,
        });
        userInfo = response;
        this.checkIsFriend(userInfo, owner);
      }).catch(() => {
        warningMessage(false, 'Unable to fetch data from server. Please try again!');
      });
    } else if (userInfo.publicKey === owner) {
      this.setState({
        showChatButton: false,
        showAddFrButton: false,
      });
    } else {
      this.checkIsFriend(userInfo, owner);
    }
  }

  checkIsFriend(userInfo, ownerId) {
    if (userInfo.friend_list.includes(ownerId)) {
      this.setState({
        showChatButton: true,
        showAddFrButton: false,
      });
    } else if (userInfo.publicKey === ownerId){
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

  render() {
    const {showAddFrButton ,showChatButton } = this.state;
    const product = this.state.productItem;
    const isTourOpen = this.state.isTourOpen;
    const images = product.images || [];
    const rules = product.rules || [];
    const account = product.account;
    const imageUrl = images.length > 0 ? `${API_ROOT}/${ images[0] }` : imageDefault;

    const { imgStyle } = styles;
    const imageStyle = Object.assign({}, imgStyle, { backgroundImage: `url(${imageUrl})` });
    const tourConfig =[];
    if(showAddFrButton) {
      tourConfig.push(
        {
        selector: '[data-tut="tour_connect"]',
        content: 'Let \'s add him like your member so that you can send the message to him',
      })
    }
    if(showChatButton) {
      tourConfig.push({
        selector: '[data-tut="tour_add"]',
        content: 'Try to connect with your friend',
      })
    }
    return (
      <ProductDetailWrapper>
        {(showChatButton || showAddFrButton) &&
        (
          <ButtonTour handleCloseTuor={this.openTour} />
        )
        }
        <Container style={styles.container}>
          <DynamicProductBreadCrumb
            category={product.category ? product.category : 'All'}
            productName={product.name ? product.name : 'made by EDEN'}
          />
          <Spin spinning={this.state.isLoading} size="large">

            <Row>
              <Col xs="4">
                <div style={imageStyle}/>
              </Col>
              <Col xs="7">
                <h3 className="my-3" style={styles.productTitle}>
                  {product.name}
                </h3>
                <h2 className="my-3" style={styles.price}>
                  {`EDN ${Common.formatNumber(product.price)}`}
                </h2>

                <div className="container">
                  <div className="row" style={styles.paddingBottom}>
                    <div className="pull-left" style={styles.colorInforms}>
                      Status
                    </div>
                    <span className="pull-right" style={styles.pullRight}>
                      {product.status}
                    </span>
                  </div>
                  <div className="row" style={styles.paddingBottom}>
                    <div className="pull-left" style={styles.colorInforms}>
                      Category
                    </div>
                    <span className="pull-right" style={styles.pullRight}>
                      {product.category}
                    </span>
                  </div>
                  <div className="row" style={styles.paddingBottom}>
                    <div className="pull-left" style={styles.colorInforms}>
                      Repeatable Option
                    </div>
                    <span className="pull-right" style={styles.pullRight}>
                  {rules.map((rule) => (rule.hasOwnProperty('type') ? this.formatRepeatableOption(rule.type) : ''))}
                </span>
                  </div>
                  <div className="row" style={styles.paddingBottom}>
                    <div className="pull-left" style={styles.colorInforms}>
                      Quantity
                    </div>
                    <span className="pull-right" style={styles.pullRight}>
                      {product.quantity}
                    </span>
                  </div>
                </div>
                { this.state.isDisplayBuyButton ?
                  <Button
                    size="large"
                    style={styles.buttonBuyNow}
                    onClick={this.showModal}>
                    Buy now
                  </Button> : null
                }
                <BuyItemModal
                  price={this.state.price}
                  visible={this.state.visible}
                  onCancel={this.onCancel}
                  onOk={this.onBuyItem}/>
              </Col>
            </Row>
            <Row style={styles.rowSellerAvatar}>
              <Col xs="1">
                <div className="pull-left pt-1">
                  <Link to={account ? `/store/view-member/`+ account.publicKey : ''} style={styles.sellerName}>
                    <img
                      src={account && account.avatar ? `${API_ROOT}/${account.avatar}` : avatarDefault}
                      style={styles.avatar}
                      alt=""/>
                  </Link>
                </div>
              </Col>
              <div className="pull-right">
                <Link to={account ? `/store/view-member/`+ account.publicKey : ''} style={styles.sellerName}>
                  {account ? account.label : 'Seller'}
                </Link>
              </div>
              <div style={styles.addMember}>
                <div>
                  {  showAddFrButton ?
                    <p className="pull-left">
                      <Popconfirm placement="topLeft" title="Are you sure to add friend ?" onConfirm={this.addFriend}
                                  okText="Yes" cancelText="Cancel">
                        <Button style={styles.buttonAddMember} data-tut="tour_connect">Add member</Button>
                      </Popconfirm>
                    </p> : null
                  }
                  {  showChatButton ?
                    <p className="pull-left">
                      <Link to={`/account/message-box/${account ? account.publicKey : ''}`}>
                        <Button style={styles.buttonChat} data-tut="tour_add">
                          Chat
                        </Button>
                      </Link>
                    </p> : null
                  }
                </div>
              </div>
            </Row>
            <Row>
              <div style={styles.description}>
                <div style={styles.descriptionTitle}>Description</div>
                {product.description}
              </div>
            </Row>
          </Spin>

          <CommentBox comments={this.state.comments}
                      pagination={this.state.pagination}
                      avatar={avatarDefault}
                      onChangePageSize={this.onChangePageSize}
                      onChange={this.onChangeComment}
                      value={this.state.textComment}
                      onKeyUp={this.handleKeyPress}
                      isError={this.state.isError}
                      onComment={this.onSubmitComment}
                      isShowAddCommentButton={true}
          />
        </Container>
        <Tour
          onRequestClose={this.closeTour}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
        />
      </ProductDetailWrapper>
    );
  }
}

ProductDetail.propTypes = {
  handleUserUpdate: PropTypes.func,
  category: PropTypes.string,
  name: PropTypes.string,
};

ProductDetail.defaultProps = {
  handleUserUpdate: null,
  category: '',
  name: '',
};

const ProductDetailWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 140px);
}
`;
export default ProductDetail;
