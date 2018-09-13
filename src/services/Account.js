import axios from 'axios';
import { API_ROOT } from '../config';
import Authentication from './Authentication';

const Account = {
  getMemberList(params = {}, index = 1, pageSize = 50) {
    return axios.get(`${API_ROOT}/accounts/members`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
      params: {
        index,
        page_size: pageSize,
        ...params,
      },
    });
  },

  getMemberDetail(memberId) {
    return axios.get(`${API_ROOT}/accounts/${memberId}/member`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    });
  },

  addFriend(memberId) {
    return axios.post(`${API_ROOT}/accounts/add-friend/${memberId}`, {}, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    });
  },
};

export default Account;
