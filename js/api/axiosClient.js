import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api/',
  headers: {
    'Content-Type': 'Application/Json',
  },
});

export default axiosClient;
