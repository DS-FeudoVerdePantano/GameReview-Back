const nodemailer = require('nodemailer');

const user = process.env.USER;
const pass = process.env.PASS;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass
    }
});

module.exports.sendConfirmationEmail = (name, email,confirmationCode ) => {
    console.log("enviou o email");
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please activate your account.",
        html: `<h1>Welcome to the Capivarinhas!</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for registering your account. Please confirm your email by clicking on the following link</p>
        <p> //localhost:3333/auth/confirm/${confirmationCode}</p> 
        </div>`,
    }).catch(error); {
        return res.status(401).json({error: 'Could not send the email'})
    }
}