import axios from 'axios';

const setAuthToken = userToken => {
  if (userToken) axios.defaults.headers.common['authorization'] = userToken;
  else delete axios.defaults.headers.common['authorization'];
};

export default setAuthToken;