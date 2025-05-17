import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/api/users';

const getCurrentUser = () => {
  return axios.get(API_URL + '/me', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem(process.env.REACT_APP_TOKEN_NAME),
    },
  });
};

export default {
  getCurrentUser,
};