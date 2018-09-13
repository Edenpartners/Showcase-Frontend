import axios from 'axios';
import { API_ROOT } from '../config';
import Authentication from './Authentication';

const Assets = {
  getList(params = {}, index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/holdings`, {
      params: {
        index,
        page_size: pageSize,
        ...params,
      },
    });
  },

  gitListByCurrentUser(params = {}, index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/holdings/my-holding`, {
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
};

export default Assets;
