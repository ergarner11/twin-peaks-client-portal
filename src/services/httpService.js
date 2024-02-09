import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(null, error => {
  if (error && error.response.status === 401 && window.location.pathname !== '/login') {
    localStorage.removeItem('loggedIn');
    window.location = '/login';
  } else {
    throw error;
  }
});

//TODO: test this
/*axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
        console.log('Something went wrong', error);
        alert('An unexpected error occured.');
    }

    return Promise.reject(error);
});*/

const httpOptions = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export default httpOptions;