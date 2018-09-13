import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChatInput extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleOnSubmit(event) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      const { message } = this.state;
      const { handleSend } = this.props;
      if (typeof handleSend === 'function') {
        handleSend(message);
      }
      this.setState({ message: '' });
    }
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    const { message } = this.state;
    const { sending } = this.props;
    return (
      <form noValidate style={styles.chatInputWrapper} id="chat-input-form" onSubmit={this.handleOnSubmit}>
        <input type="text" name="message" style={styles.chatInput} onChange={this.handleChange} value={message} autoComplete="off" required />
        <button type="submit" style={styles.sendBtn} disabled={sending}>
          {sending ? 'Sending' : 'Send'}
        </button>
      </form>
    );
  }
}

ChatInput.propTypes = {
  handleSend: PropTypes.func,
  sending: PropTypes.bool,
};

ChatInput.defaultProps = {
  handleSend: null,
  sending: false,
};

const styles = {
  chatInputWrapper: {
    height: 75,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
  chatInput: {
    width: '100%',
    marginTop: 10,
    border: 0,
    outline: 0,
    borderBottom: '1px solid',
    marginRight: 20,
  },
  sendBtn: {
    backgroundColor: '#27a4fc',
    width: 84,
    height: 41,
    borderRadius: 4,
    color: '#ffffff',
  },
};

export default ChatInput;
