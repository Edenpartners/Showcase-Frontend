import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import RoundAvatar from '../Avatar/RoundAvatar';

const MessageItem = (
  {
    isOwner, text, dateTime, avatar,
  },
) => (
  <Row>
    <Col md={{ size: 1, order: isOwner ? 'last' : 'first' }}>
      <RoundAvatar avatar={avatar} size={34} />
    </Col>
    <Col md={{ size: 8, offset: isOwner ? 3 : 0 }}>
      <div style={styles.messageTextWrapper}>
        <p style={styles.content}>
          {text}
        </p>
      </div>
      <p style={{ color: '#637097', fontSize: 14, marginTop: 8 }} className={isOwner ? 'pull-right' : ''}>
        {dateTime}
      </p>
    </Col>
  </Row>
);

MessageItem.propTypes = {
  isOwner: PropTypes.bool,
  text: PropTypes.string,
  dateTime: PropTypes.string,
  avatar: PropTypes.string,
};

MessageItem.defaultProps = {
  isOwner: true,
  text: null,
  dateTime: null,
  avatar: null,
};

const styles = {
  messageTextWrapper: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  content: {
    margin: 0,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
};

export default MessageItem;
