import axios from 'axios';
import { isEmpty } from 'lodash';
import errorHandling from './errorHandling';
import Authentication from './Authentication';
import { API_ROOT } from '../config';

// const queryString = require('querystring');

export const getRequest = (url, queryParams) => {
  let newUrl = url;
  if (!isEmpty(queryParams)) {
    newUrl = `${newUrl}/${queryParams}`;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(newUrl, {
        'Content-Type': 'application/json',
        headers: {
          authorization: Authentication.getAuthKey(),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        errorHandling(error);
        reject(error);
      });
  });
};

export const getRequestRevenue = (url, queryParams) => {
  let newUrl = url;
  if (!isEmpty(queryParams)) {
    newUrl = `${newUrl}?${queryParams}`;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(newUrl, {
        'Content-Type': 'application/json',
        headers: {
          authorization: Authentication.getAuthKey(),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        errorHandling(error);
        reject(error);
      });
  });
};

export const postRequest = (data, url) => {
  const path = `${API_ROOT}/${url}`;
  const axiosConfig = {
    headers: {
      authorization: Authentication.getAuthKey(),
    },
  };
  return new Promise((resolve, reject) => {
    axios.post(path, data, axiosConfig)
      .then((response) => {
        resolve(response.data);
      }).catch((error) => {
        errorHandling(error);
        reject(error);
      });
  });
};

export const patchRequest = (data, url) => {
  const path = `${API_ROOT}/${url}`;
  const axiosConfig = {
    headers: {
      authorization: Authentication.getAuthKey(),
    },
  };
  return new Promise((resolve, reject) => {
    axios.patch(path, data, axiosConfig)
      .then((response) => {
        resolve(response.data);
      }).catch((error) => {
        errorHandling(error);
        reject(error);
      });
  });
};
