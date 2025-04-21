import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const request = async ({ method = 'get', url, data = {} }) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error.response?.data || error;
  }
};

export default request;
