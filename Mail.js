var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "educationmandal.com",
    port: 465,
    secure: true,
 auth: {
        user: 'noreply@educationmandal.com',
        pass: 'If-,Xb9@T8?,'
    }
});

module.exports=transporter;