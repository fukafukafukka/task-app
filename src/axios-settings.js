import axios from 'axios';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8081';

axios.defaults.withCredentials = true

export default axios