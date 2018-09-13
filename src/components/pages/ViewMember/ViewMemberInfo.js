import React, { Component } from 'react';
import { Button, Row } from 'reactstrap';
import { Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import UserImage from '../../../assets/img/user.png';
import { getRequest } from '../../../services/axiosApi';
import { API_ROOT } from '../../../config';
import warningMessage from '../../common/WarningMessage/warningMessage';
import Account from '../../../services/Account';

class ViewMemberInfo extends Component {
  constructor() {
    super();

    this.state = {
      memberInfo: {},
    };
    this.addFriend = this.addFriend.bind(this);
  }

  componentDidMount() {
    const api = getRequest(`${API_ROOT}/accounts/${this.props.ownerPublicKey}/member`);
    api.then((response) => {
      this.setState({
        memberInfo: response,
      });
      document.title = response.label;
    }).catch(() => {
      warningMessage(false, 'Oh some thing went wrong, please try again!', 3);
    });
  }

  addFriend() {
    console.log(this.props)
    const { updateUserInfoCallback } = this.props;
    const addFriendApi = Account.addFriend(this.props.ownerPublicKey);
    addFriendApi.then(() => {
      warningMessage(true, 'Success');
      if (typeof updateUserInfoCallback === 'function') {
        updateUserInfoCallback();
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
  }
  /**
   * Handle page changed
   * @param page
   */

  render() {
    const { memberInfo } = this.state;
    const { showChatButton, showAddFrButton } = this.props;
    let $imagePreview = null;
    if (!memberInfo.avatar) {
      $imagePreview = (<img src={UserImage} style={styles.userImgStyle} alt="" />);
    } else {
      $imagePreview = (<img src={`${`${API_ROOT}/${memberInfo.avatar}`}`} style={styles.userImgStyle} alt="" />);
    }
    return (
      <Row style={styles.backGroundStyle} className="pt-2 pb-2">
        <div style={styles.w12}>
          {$imagePreview}
        </div>
        <div style={styles.w88}>
          <Row className="pt-3">
            <p style={styles.textNameStyle} className="pl-3">
              {memberInfo.label}
            </p>
            <div style={styles.w70}>
              <Row className="float-right pr-5">
                {showAddFrButton ? (
                  <div className="pr-2">
                    <Popconfirm
                      placement="topLeft"
                      title="Are you sure to add friend ?"
                      onConfirm={this.addFriend}
                      okText="Yes"
                      cancelText="Cancel"
                    >
                      <Button style={styles.buttonStyleWhite}>
                      Add member
                      </Button>
                    </Popconfirm>
                  </div>
                ) : null}
                { showChatButton
                  ? (
                    <div className="pr-3">
                      <Link to={`/account/message-box/${memberInfo ? memberInfo.publicKey : ''}`}>
                        <Button style={styles.buttonStyleWhite}>
                          Chat
                        </Button>
                      </Link>
                    </div>
                  ) : null
                }
              </Row>
            </div>
          </Row>
          <Row>
            <p style={styles.textDescriptionStyle} className="pl-3">
              {memberInfo.description}
            </p>
          </Row>
        </div>
      </Row>
    );
  }
}

export default ViewMemberInfo;

const styles = {
  backGroundStyle: {
    height: '130px',
    backgroundColor: 'white',
  },
  userImgStyle: {
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    width: 60,
    height: 60,
    position: 'absolute',
    borderRadius: 40,
    bottom: 45,
    left: 45,
  },
  textNameStyle: {
    fontSize: '18px',
    fontWeight: '600',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#010228',
    width: '25%',
  },
  textDescriptionStyle: {
    fontSize: '14px',
    fontWeight: '400',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#010228',
  },
  w12: {
    width: '12.5%',
    height: '120px',
  },
  w88: {
    width: '87.5%',
    height: '120px',
  },
  buttonStyleWhite: {
    width: '100px',
    height: '30px',
    backgroundColor: '#ffffff',
    color: '#637097',
    borderRadius: '2px',
    border: 'solid 1px #637097',
    fontSize: '12px',
  },
  w70: {
    width: '70%',
  },
  w50: {
    width: '50%',
  },
};
