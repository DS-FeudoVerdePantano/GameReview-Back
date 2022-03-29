const axios = require('axios');

const api = axios.create({
    baseURL: "https://api.rawg.io/api/"
});

module.exports = api;