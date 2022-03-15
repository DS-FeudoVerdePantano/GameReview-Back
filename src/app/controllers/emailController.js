//Arquivo responsável por rotas de autenticação de email e relacionados

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authConfig = require('../../config/auth.json');
const nodemailer = require('nodemailer');
const { send } = require('express/lib/response');

const router = express.Router();

const user = process.env.USER;
const pass = process.env.PASS;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

const sendEmail = (email, emailToken) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: "Your reset password token arrived",
        html: `<h1>Here's your token</h1>
        <h2>Hello </h2>
        <p>You can reset your password now by clicking on the following link:</p>
        <a href="localhost:3333//validateToken//forgot-password/${emailToken}"> ${emailToken}</a> 
        `,
    });
};

//rota do esqueci minha senha

router.put('/forgot-password', (req,res) => {
    const {email} = req.body;

    const user = User.findOne({email}, (error, User) => {
        if(error || !User) {
            console.log("Email not found in database");
            return res.status(401).json({error: 'Invalid email'});
        }
    });

    const emailToken = jwt.sign({ _id: user._id }, authConfig.resetpassSecret, {expiresIn: 1200} );

    User.updateOne({email}, {resetLink: emailToken}, (error, success) => {
        if(res.statusCode === 401) {
            return; // Exits the function, status Code has already been set to 401: Invalid Email
        } else if(error){
            console.log("reset password error");
            return res.status(500).json({error: 'reset password error'});
        } else { 
            sendEmail(email, emailToken);
            console.log("email sent");
            return sendEmail( email,emailToken), res.status(200).json({message: 'email sent'});
        }
    });
});

module.exports = app => app.use('/mail', router);