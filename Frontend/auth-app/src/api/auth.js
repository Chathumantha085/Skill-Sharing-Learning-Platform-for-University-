import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/api/auth';

const register = (username, email, password, bio, profilePicture, skills) => {
  return axios.post(API_URL + '/signup', {
    username,
    email,
    password,
    bio,
    profilePicture,
    skills
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + '/signin', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem(process.env.REACT_APP_TOKEN_NAME, response.data.accessToken);
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem(process.env.REACT_APP_TOKEN_NAME);
};

export default {
  register,
  login,
  logout,
};