const express = require('express');
const api = require('../service/api');

const router = express.Router();

router.get('/games', async (req, res) =>{
    try{
        const {data} = await api.get(`games?key=${process.env.API_KEY}&page_size=2`);

        return res.send({data: data});
    } catch (error){

        return res.status(400).json({error: 'Could not access API'});
    }
});

module.exports = app => app.use('/rawg', router);