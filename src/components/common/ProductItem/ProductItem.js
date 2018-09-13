import React, { Component } from 'react';
import {
  Card, CardBody, CardTitle,
} from 'reactstrap';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UserImage from '../../../assets/img/user.png';
import EditBtn from '../../../assets/img/icons/btn-edit.png';
import ItemBank from '../../../assets/img/item-blank.jpg';
import IconComment from '../../../assets/img/icons/comment.png';

import Common from '../../../services/Common';
import RegisterProduct from '../../pages/Product/RegisterProduct';
import { API_ROOT } from '../../../config';

class ProductItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      visible: false,
    };

    this.onCancel = this.onCancel.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  onCancel() {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  showModal() {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  }

  handleCloseModal() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { productData, showAvatar, isPublished } = this.props;
    const { visible } = this.state;
    const productImage = productData.images ? `${API_ROOT}/${productData.images[0]}` : ItemBank;
    const { imgStyle } = styles;
    const imageStyle = Object.assign({}, imgStyle, { backgroundImage: `url(${productImage})` });
    return (
      <div>
        <Card style={styles.cardStyle}>
          <Link to={isPublished ? `/store/product-detail/${productData.id}` : `/account/view-assets/${productData.id}`}>
            <div style={imageStyle} />
          </Link>
          <CardBody style={styles.cardBodyStyle}>
            <CardTitle style={styles.cardTitleStyle}>
              {productData.asset ? Common.shortenString(productData.asset, 55) : 'N/A'}
            </CardTitle>
            {!isPublished && (
              <div style={styles.actionGroup}>
                <Link to={`/account/view-assets/${productData.id}`}>
                  <ActionButton type="button" className="pull-left">
                    <img src={EditBtn} width="28" height="28" alt="" />
                  </ActionButton>
                </Link>
              </div>
            )}
            {showAvatar && (
              <Avatar style={styles.userImgStyle} src={productData.account.avatar ? `${API_ROOT}/${productData.account.avatar}` : UserImage} />
            )}
            {isPublished && (
              <div>
                <div className="pull-left">
                  <span style={styles.moneyStyle}>
                    {`${Common.formatNumber(productData.price)} EDN`}
                  </span>
                </div>
                <div className="pull-right">
                  <ActionButton type="button">
                    <img src={IconComment} width="14" height="14" alt="comment" />
                    <span style={{ marginLeft: 2, color: '#4a4a4a' }}>
                      {productData.total_comment}
                    </span>
                  </ActionButton>
                </div>
              </div>
            )}
            {!isPublished && (
              <div>
                <div className="pull-left" style={{ width: '38%' }}>
                  <span>
                    {`Count: ${productData.quantity}`}
                  </span>
                </div>
                <button type="button" className="pull-right" style={styles.publishBtnStyle} onClick={this.showModal}>
                  Publish to market
                </button>
                <RegisterProduct
                  {...this.props}
                  visible={visible}
                  onCancel={this.onCancel}
                  productData={productData}
                  handleCloseModal={this.handleCloseModal}
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

ProductItem.propTypes = {
  isPublished: PropTypes.bool,
  showAvatar: PropTypes.bool,
  productData: PropTypes.shape.isRequired,
};

ProductItem.defaultProps = {
  isPublished: false,
  showAvatar: false,
};

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
`;

const styles = {
  actionGroup: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  userImgStyle: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 12,
    top: 205,
  },
  cardTitleStyle: {
    height: 34,
    margin: 0,
    fontSize: 14,
    fontWeight: 'normal',
    color: '#010228',
  },
  cardBodyStyle: {
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  cardStyle: {
    borderRadius: 0,
    border: 'none',
  },
  imgStyle: {
    width: 253,
    height: 255,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
  moneyStyle: {
    color: '#ff8976',
    fontSize: 16,
    fontWeight: 'bold',
  },
  publishBtnStyle: {
    width: '62%',
    height: 24,
    color: '#ffffff',
    fontSize: 12,
    borderRadius: 2,
    border: 'none',
    backgroundColor: '#004f50',
  },
};

export default ProductItem;
