import React from 'react';
import { Link } from 'react-router-dom';
import imgemail from '../../assets/email.jpg';
import './SignUpPage.css';

const ConfirmCode = () => {
  const email = 'nhatnguyen@gmail.com';  

  return (
    <div className="signup-page">
    <div className="login-container">
      <div className="login-box">
        <div>
          <img src={imgemail} alt="Email Confirmation" className="img-cake" />
        </div>
        <div className="input-born-title">Nhập mã xác nhận</div>
        <div className="text-born">
          Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ {email}.
          <Link to="#" className="resend-link"> {' '}Gửi lại mã</Link>
        </div>
        <form className="signup-form">
          <div className="input-group">
            <input
              type="text"  
              name="confirmationCode"
              placeholder="Nhập mã xác nhận"
              required
            />
          </div>
        </form>
        <button
          type="submit"
          className="continue-btn"
          aria-label="Tiếp tục"
        >
          Tiếp tục
        </button>
        <div className="back-text">
          <Link to='/signup' className="back-link">
            Quay lại
          </Link>
        </div>
      </div>
      <div className="back-login-box">
        <div className="login-option-box">
          Bạn đã có tài khoản?{' '}
          <Link to="/" className="login-link">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ConfirmCode;
