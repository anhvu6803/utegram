const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


exports.sendVerificationEmail = (to, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Mã xác thực đăng ký tài khoản UTEGRAM',
        text: `Mã xác thực của bạn là: ${code} \n Vui lòng nhập mã này vào trang web để hoàn tất quá trình đăng ký tài khoản.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
