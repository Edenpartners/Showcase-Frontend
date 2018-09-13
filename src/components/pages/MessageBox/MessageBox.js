import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Spin, Avatar, Button, message, Tooltip, Icon, Popconfirm,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, ListGroup,
} from 'reactstrap';
import MessageItem from '../../common/MessageItem/MessageItem';
import ChatInput from './ChatInput';
import SearchInput from './SearchInput';
import MemberItem from './MemberItem';
import Account from '../../../services/Account';
import { API_ROOT } from '../../../config';
import WelcomeBox from './WelcomeBox';
import Chat from '../../../services/Chat';
import Authentication from '../../../services/Authentication';
import Common from '../../../services/Common';
import { patchRequest } from '../../../services/axiosApi';
import warningMessage from '../../common/WarningMessage/warningMessage';

class MessageBox extends Component {
  constructor() {
    super();

    this.searchInterval = null;

    this.state = {
      activeMember: {},
      isListenMessageScroll: false,
      isMemberLoading: false,
      isMessageLoading: false,
      isSending: false,
      currentMemberPage: 1,
      totalMember: 0,
      currentMessagePage: 1,
      totalMessage: 0,
      nameSearch: '',
      messages: [],
      members: [],
    };

    this.handleMemberClick = this.handleMemberClick.bind(this);
    this.searchByName = this.searchByName.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.handleMemberListScroll = this.handleMemberListScroll.bind(this);
    this.handleMessageListScroll = this.handleMessageListScroll.bind(this);
  }

  componentDidMount() {
    this.fetchMembers();
    const { match } = this.props;

    if (match.params.memberId !== 'all') {
      // Get member detail
      Account.getMemberDetail(match.params.memberId).then((response) => {
        this.setState({
          activeMember: {
            friend_id: match.params.memberId,
            member_info: {
              avatar: response.data.avatar,
              label: response.data.label,
            },
          },
        }, () => {
          this.fetchMessages(match.params.memberId);
        });
      });
    }

    const element = document.getElementById('member-list');
    element.addEventListener('scroll', this.handleMemberListScroll);
  }

  componentWillUnmount() {
    const element = document.getElementById('member-list');
    element.removeEventListener('scroll', this.handleMemberListScroll);

    const messageWrapper = document.getElementById('message-wrapper');
    if (messageWrapper) {
      messageWrapper.removeEventListener('scroll', this.handleMessageListScroll);
    }
  }

  handleMemberListScroll(e) {
    const { currentMemberPage, totalMember, nameSearch } = this.state;
    const element = e.target;
    if (element.clientHeight + element.scrollTop >= element.scrollHeight) {
      const nextPage = currentMemberPage + 1;
      if (currentMemberPage * 50 < totalMember) {
        this.setState({ currentMemberPage: nextPage }, () => {
          this.fetchMembers(nextPage, nameSearch);
        });
      }
    }
  }

  handleMessageListScroll(e) {
    const { currentMessagePage, totalMessage, activeMember } = this.state;
    const element = e.target;

    if (element.scrollTop === 0) {
      const nextPage = currentMessagePage + 1;
      if (currentMessagePage * 50 < totalMessage) {
        this.setState({ currentMessagePage: nextPage }, () => {
          this.fetchMessages(activeMember.friend_id, nextPage);
        });
      }
    }
  }

  deleteFriend(friendId) {
    const api = patchRequest({}, `accounts/remove-friend/${friendId}`);
    const { history } = this.props;
    api.then(() => {
      const { handleUserUpdate } = this.props;
      warningMessage(true, 'Deleted !', 3);
      this.fetchMembers();
      this.setState({ activeMember: {} }, () => {
        history.push('/account/message-box/all');
      });
      if (typeof handleUserUpdate === 'function') {
        handleUserUpdate();
      }
    }).catch(() => {
      warningMessage(false, 'Delete fail, please try again !', 3);
    });
  }

  handleRefresh() {
    const { match } = this.props;
    this.fetchMessages(match.params.memberId);
  }

  fetchMembers(page = 1, name = '') {
    const { members } = this.state;
    this.setState({ isMemberLoading: true }, () => {
      Account.getMemberList({ name }, page).then((response) => {
        if (page > 1) {
          this.setState({
            members: [...members, ...response.data.results],
            isMemberLoading: false,
          });
        } else {
          this.setState({
            members: response.data.results,
            totalMember: response.data.meta.total_record,
            isMemberLoading: false,
          });
        }
      });
    });
  }

  fetchMessages(memberId, page = 1) {
    const { messages, isListenMessageScroll } = this.state;
    this.setState({ isMessageLoading: true }, () => {
      Chat.getMessages(memberId, page).then((response) => {
        this.setState({
          messages: page > 1
            ? [...response.data.results.reverse(), ...messages] : response.data.results.reverse(),
          totalMessage: response.data.meta.total_record,
          isMessageLoading: false,
        }, () => {
          if (!isListenMessageScroll) {
            this.setState({ isListenMessageScroll: true }, () => {
              const messageWrapper = document.getElementById('message-wrapper');
              messageWrapper.addEventListener('scroll', this.handleMessageListScroll);
            });
          }
          if (page === 1) {
            setTimeout(() => {
              const objDiv = document.getElementById('message-wrapper');
              if (objDiv) {
                objDiv.scrollTop = objDiv.scrollHeight;
              }
            }, 500);
          }
        });
      });
    });
  }

  handleMemberClick(member) {
    const { history } = this.props;
    const { activeMember } = this.state;

    if (activeMember.friend_id !== member.friend_id) {
      this.setState({ activeMember: member }, () => {
        history.push(`/account/message-box/${member.friend_id}`);
        this.fetchMessages(member.friend_id);
      });
    }
  }

  handleSendMessage(messageContent) {
    const { activeMember } = this.state;
    this.setState({ isSending: true }, () => {
      Chat.sendMessage(activeMember.friend_id, messageContent).then(() => {
        this.setState({ isSending: false }, () => {
          this.fetchMessages(activeMember.friend_id);
        });
      }).catch(() => {
        this.setState({ isSending: false }, () => {
          message.error('Unable to send message');
        });
      });
    });
  }

  searchByName(event) {
    const name = event.target.value;
    if (this.searchInterval) {
      clearInterval(this.searchInterval);
      this.searchInterval = null;
    }

    this.searchInterval = setInterval(() => {
      this.setState({ nameSearch: name }, () => {
        this.fetchMembers(1, name);
      });

      clearInterval(this.searchInterval);
      this.searchInterval = null;
    }, 200);
  }

  renderMessages() {
    const { messages } = this.state;
    return messages.map((msg) => {
      const isOwner = msg.sender.public_key === Authentication.getPublicKey();
      const avatar = msg.sender.avatar ? `${API_ROOT}/${msg.sender.avatar}` : '';
      return (
        <MessageItem
          key={msg.id}
          isOwner={isOwner}
          text={msg.content}
          dateTime={Common.formatDate(msg.encoded_created_date)}
          avatar={avatar}
        />
      );
    });
  }

  renderMembers() {
    const { members, activeMember } = this.state;
    return members.map(member => (
      <MemberItem
        key={member.friend_id}
        active={activeMember.friend_id === member.friend_id}
        tag="button"
        onClick={() => { this.handleMemberClick(member); }}
        action
        style={styles.memberBtn}
      >
        <Avatar size={34} icon="user" className="pull-left" src={`${API_ROOT}/${member.member_info.avatar}`} />
        <p className="pull-left" style={styles.memberName}>
          {member.member_info.label}
        </p>
        <Popconfirm placement="topLeft" title="Are you sure to delete friend ?" onConfirm={() => { this.deleteFriend(member.friend_id); }} okText="Yes" cancelText="Cancel">
          <Icon style={styles.trashIconStyle} className="position-absolute" type="delete" />
        </Popconfirm>
      </MemberItem>
    ));
  }

  render() {
    const {
      isMemberLoading, isMessageLoading, activeMember, isSending,
    } = this.state;
    return (
      <Container>
        <Row style={styles.wrapper}>
          <Col md="3" style={styles.memberList}>
            <Col md="12" style={styles.memberHead}>
              <SearchInput onChange={this.searchByName} placeholder="Search member" />
            </Col>
            <Col md="12" style={{ padding: 0 }}>
              <Spin spinning={isMemberLoading} size="large">
                <ListGroup style={styles.listGroup} id="member-list">
                  {this.renderMembers()}
                </ListGroup>
              </Spin>
            </Col>
          </Col>
          {activeMember.friend_id && (
            <Col md="9" style={styles.messageList}>
              <div style={styles.messageHead}>
                <Link to={`/store/view-member/${activeMember.friend_id}`} style={{ color: '#010228' }}>
                  {activeMember.member_info ? activeMember.member_info.label : ''}
                </Link>
                <Tooltip placement="topRight" title="Refresh">
                  <Button shape="circle" icon="reload" size="small" onClick={this.handleRefresh} style={{ marginLeft: 5 }} />
                </Tooltip>
              </div>
              <Spin spinning={isMessageLoading} size="large">
                <div style={styles.messageBoxWrapper} id="message-wrapper">
                  {this.renderMessages()}
                </div>
              </Spin>
              <ChatInput handleSend={this.handleSendMessage} sending={isSending} />
            </Col>
          )}
          {!activeMember.friend_id && (
            <Col md="9" style={styles.messageList}>
              <WelcomeBox />
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}

MessageBox.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      memberId: PropTypes.string,
    }),
  }),
  handleUserUpdate: PropTypes.func,
};

MessageBox.defaultProps = {
  history: {
    push: null,
  },
  match: {
    params: {
      memberId: null,
    },
  },
  handleUserUpdate: null,
};

const styles = {
  wrapper: {
    height: 'calc(100vh - 137px)',
  },
  memberList: {
    backgroundColor: '#ffffff',
    borderRight: '1px solid #dcdce7',
    padding: 0,
  },
  listGroup: {
    height: 'calc(100vh - 202px)',
    overflowY: 'auto',
  },
  memberName: {
    marginTop: 4,
    marginLeft: 17,
    marginBottom: 0,
  },
  memberBtn: {
    outline: 'none',
  },
  memberHead: {
    height: 65,
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  messageList: {
    backgroundColor: '#f2f3f5',
    padding: 0,
  },
  messageHead: {
    backgroundColor: '#ffffff',
    border: '1px solid #dcdce7',
    height: 65,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: 'none',
    fontWeight: 600,
    color: '#010228',
  },
  messageBoxWrapper: {
    padding: 20,
    height: 'calc(100vh - 278px)',
    overflow: 'auto',
  },
  trashIconStyle: {
    top: 15,
    right: 15,
  },
};
export default MessageBox;
