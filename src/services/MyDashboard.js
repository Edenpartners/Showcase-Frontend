import axios from 'axios';
import { API_ROOT } from '../config';
import Authentication from './Authentication';

const MyDashboard = {
  get() {
    return axios.get(`${API_ROOT}/accounts/my-dashboard`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    });
  },

  chargeEDN() {
    return axios.post(`${API_ROOT}/holdings/charge`, {}, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    });
  },

  getMyActivities(index = 1, pageSize = 10) {
    return axios.get(`${API_ROOT}/accounts/my-activities`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
      params: {
        index,
        page_size: pageSize,
      },
    });
  },

  getRevenue(index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/accounts/revenues`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
      params: {
        index,
        page_size: pageSize,
      },
    });
  },
};

export default MyDashboard;
