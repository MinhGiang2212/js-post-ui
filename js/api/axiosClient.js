import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    //Attach token to request if exists
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.log('axiosClient response error', error.response);
    if (!error.response) throw new error('Do something when wrong');

    //redirect login if not login
    if (error.response.status === 401) {
      window.location.assign('/login.html');
      return;
    }

    // return Promise.reject(error);
    throw new error(error);
  }
);
export default axiosClient;
