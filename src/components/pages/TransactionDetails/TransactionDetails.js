import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'antd';
import styled from 'styled-components';
import { API_ROOT } from '../../../config';
import { CommentBox } from '../Product/CommentBox';
import { getRequest } from '../../../services/axiosApi';
import { styles } from '../Product/StyleProductDetail';
import warningMessage from '../../common/WarningMessage/warningMessage';
import {DynamicProductBreadCrumb} from '../DynamicBreadCrumb/DynamicProductBreadCrumb';
import {REPEATABLE_OPTION_DISPLAY_MESSAGES, TYPE_MESSAGES} from "../../common/const/Messages";
import Account from '../../../services/Account';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const defaultAvatar = require('../../../assets/img/user.png');
const imageDefault = '';

class TransactionDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      productID:'',
      productItem: {},
      comments: [],
      price: 0,
      pagination: {
        index: 1,
        pageSize: 10,
        totalRecords: 50,
      },
      showChatButton: true,
      showAddFrButton: true,
    };
  }
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
  componentDidMount() {
    document.title = 'Transaction details';
    const { id } = this.props.match.params;
    this.setState({
      productID: id,
    });
    const api = getRequest(`${API_ROOT}/offers`, `${id}/details`);
    api.then((response) => {
      this.setState({
        productItem: response,
        price: response.price,
      });
      this.getInputInformation(response.account.publicKey);
    }).catch(() => {
      warningMessage(false, 'Unable to fetch data from server. Please try again!', 3);
    });

    const apiComment = getRequest(`${API_ROOT}/comments`, id);
    apiComment.then((response) => {
      const result = response.results;
      const meta = response.meta;
      this.setState({
        comments: result.reverse(),
        pagination: {
          index: meta.index,
          pageSize: meta.page_size,
          totalRecords: meta.total_record,
        },
      });
    });

  }

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

  onChangePageSize = (index) => {
    let pageSize = this.state.pagination.pageSize;
    let apiComment = getRequest(`${API_ROOT}/comments`, `${this.state.productID}?index=${index}&page_size=${pageSize}`);
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
      } else if (response.response.data.error.includes('Cannot add your own account')) {
        warningMessage(false, 'Cannot add your own account!', 3);
      } else {
        warningMessage(false, 'Oh something went wrong !! please try again later !!', 3);
      }
    });
  };

  render() {
    const product = this.state.productItem;
    const images = product.images || [];
    const rules = product.rules || [];
    const account = product.account;
    const {
      comments, pagination, showChatButton, showAddFrButton,
    } = this.state;
    return (
      <ProductDetailWrapper>
        <Container style={styles.container}>
          <DynamicProductBreadCrumb
            category={product.category ? product.category : 'All'}
            productName={product.name ? product.name : 'made by EDEN'}
          />
          <Row>
            <Col xs="4">
              <img className="img-fluid" style={styles.imageSize}
                   src={images.length > 0 ? `${API_ROOT}/${ images[0] }` : imageDefault} alt=""/>
            </Col>
            <Col xs="7">
              <h3 className="my-3" style={styles.productTitle}>
               {product.name}
              </h3>
              <h2 className="my-3" style={styles.price}>
                <product className="price">EDN {product.price} </product>
              </h2>

              <div className="container">
                <div className="row" style={styles.paddingBottom}>
                  <div className="pull-left" style={styles.colorInforms}>
                    Status
                  </div>
                  <span className="pull-right" style={styles.pullRight}>
                    {product.transactionStatus ? product.transactionStatus : 'completed'}
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
            </Col>
          </Row>
          <Row style={styles.rowSellerAvatar}>
            <Col xs="1">
              <div className="pull-left pt-1">
                <Link to={account ? `/store/view-member/`+ account.publicKey : ''} style={styles.sellerName}>
                  <img
                    src={account && account.avatar ? `${API_ROOT}/${account.avatar}` : defaultAvatar}
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
                { showAddFrButton ?
                  <p className="pull-left">
                    <Button style={styles.buttonAddMember} onClick={this.addFriend}>Add member</Button>
                  </p> : null
                }
                { showChatButton ?
                  <p className="pull-left">
                    <Link to={`/account/message-box/${account ? account.publicKey : ''}`}>
                      <Button style={styles.buttonChat}>
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
          <CommentBox
            comments={comments}
            pagination={pagination}
            avatar={defaultAvatar}
            isShowAddCommentButton={false}
            onChangePageSize={this.onChangePageSize}
          />
        </Container>
      </ProductDetailWrapper>
    );
  }
}

TransactionDetails.propTypes = {
  handleUserUpdate: PropTypes.func,
  category: PropTypes.string,
  name: PropTypes.string,
};

TransactionDetails.defaultProps = {
  handleUserUpdate: null,
  category: '',
  name: '',
};

const ProductDetailWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 228px);
}
`;
export default TransactionDetails;

