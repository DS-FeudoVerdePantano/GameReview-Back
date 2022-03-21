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
        expiresIn: 10800,
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
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !await bcrypt.compare(password, user.password) ) {
        return res.status(400).json({error: 'Invalid email or password'});
    }
    
    user.password = undefined;

    res.send({user, token: tokenGenerator({ id: user.id})});

});

//checa se o token é válido, tudo abaixo daqui necessita ter um token para funcionar
router.use(authMiddleware);

router.get('/:userId', async (req,res) =>{
    try {
        const user = await User.findById(req.params.userId);

        return res.send({user})
    } catch (error) {
        return res.status(400).json({error: 'error showing the user'})
    }
});

router.put('/:userId', async (req,res) =>{
    try {
        const { name, email, password } = req.body;

        const user = await User.findByIdAndUpdate(req.params.userId, {
            name,
            email,
            password
        }, { new: true });
 
        return res.send({ user });
    }catch (error) {
        return res.status(400).json({error: 'error updating the user'})
    }
});

router.delete('/:userId', async (req,res) =>{
    try {
        await User.findByIdAndRemove(req.params.userId);

        return res.send()
    } catch (error) {
        return res.status(400).json({error: 'error deleting the user'})
    }
});


module.exports = app => app.use('/auth', router);