import axios from 'axios';
import { API_ROOT } from '../config';
import Authentication from './Authentication';

const Offers = {
  getList(params = {}, index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/offers`, {
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

  getListOwnerOffer(ownerId, index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/offers`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
      params: {
        index,
        page_size: pageSize,
        owner: ownerId,
      },
    });
  },


  gitListByCurrentUser(params = {}, index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/offers/my-offers`, {
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

  getTransactionList(params = {}, index = 1, pageSize = 20) {
    return axios.get(`${API_ROOT}/offers/transactions`, {
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

export default Offers;
