// TRABALHA COM ROTAS QUE REQUEREM AUTENTICAÇÃO;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authConfig = require('../../config/auth.json');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

function tokenGenerator(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 7200,
    } );
}

router.post('/register', async (req,res) => {
    const {email} = req.body;
    
    try {
        if (await User.findOne({email})) {
        return res.status(400).json({error: 'User already exists'});
        };

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({user, token: tokenGenerator({ id: user.id})});
    
    } catch (error) {
        return res.status(400).json({error: 'Registration failed'});
    };
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !await bcrypt.compare(password, user.password) ) {
        return res.status(400).json({error: 'Invalid email or password'});
    };
       
    user.password = undefined;

    res.send({user, token: tokenGenerator({ id: user.id})});

});

router.use(authMiddleware);

router.delete('/delete', async (req, res) => {
    try{

        await User.findByIdAndRemove(req.params.userId); 
      
        return res.send();
    }catch (error) {
        return res.status(400).json({error: 'error deleting user'}); 
    };
});


module.exports = app => app.use('/auth', router);