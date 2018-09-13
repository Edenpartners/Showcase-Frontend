import axios from 'axios';
import { API_ROOT } from '../config';

const Categories = {
  getList() {
    return axios.get(`${API_ROOT}/categories`);
  },
};

export default Categories;
