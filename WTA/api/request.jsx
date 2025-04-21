import axios from 'axios';
import { store } from '../src/store/store';  

const API_BASE_URL = 'http://localhost:5000/api';

const request = async ({ method = 'get', url, data = {}, headers = {} }) => {
   const state = store.getState();
  const token = state?.auth?.token;

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    headers: {
      ...authHeaders,
      ...headers,
    },
  });

  return response;
};

export default request;
