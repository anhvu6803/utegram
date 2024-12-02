const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { setResetCode } = require('./resetCodeService');
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
            console.error('Error sending verification email:', error);
            return;
        }
        console.log('Email sent: ' + info.response);
    });
};

exports.sendCodeResetPass = (to) => {
    const code = setResetCode(to); 
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Thông tin tài khoản UTEGRAM',
        html: `<p>Mã để đặt lại mật khẩu của bạn là: <strong>${code}</strong></p><p>Mã này sẽ hết hạn sau 10 phút.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending password reset email:', error);
            return;
        }
        console.log('Sent successfully:', info.response);
    });
};
