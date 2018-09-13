import axios from 'axios';
import { API_ROOT } from '../config';
import Authentication from './Authentication';

const Chat = {
  getMessages(memberId, index = 1, pageSize = 50) {
    return axios.get(`${API_ROOT}/messages/${memberId}`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
      params: {
        index,
        page_size: pageSize,
      },
    });
  },

  sendMessage(receiver, content) {
    return axios.post(`${API_ROOT}/messages`, {
      receiver,
      content,
    }, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    });
  },
};

export default Chat;
