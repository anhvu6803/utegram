import React from 'react';
import { Link } from 'react-router-dom';
import imgChange from '../../assets/changepass.jpg';
import './ChangePassPage.css';

const ChangePassPage = () => {
  return (
    <>
      <header className="header">
        <h1 className="logo-text">UTEGRAM</h1>
      </header>
      <div className="changepass-container">
        <div className="changepass-box">
          <img src={imgChange} alt="Change Password" className="img-change" />
          <h2 className="input-title">Gặp sự cố khi đăng nhập?</h2>
          <p className="text-description">
            Nhập email, số điện thoại hoặc tên người dùng của bạn và chúng tôi sẽ gửi liên kết để bạn truy cập lại vào tài khoản.
          </p>

          <form className="changepass-form">
            <div className="input-group">
              <input
                type="text"
                name="confirmationCode"
                placeholder="Email hoặc tên người dùng"
                required
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className="send-link-btn"
              aria-label="Gửi liên kết"
            >
              Gửi liên kết
            </button>
          </form>
            <div className="line-with-text">
                <span className="line-text">Hoặc</span>
            </div>

          <div className="signup-text">
            <Link to="/signup" className="signup-link">
              Tạo tài khoản mới
            </Link>
          </div>
        </div>

        <div className="back-login-box">
          <Link to="/" className="login-link">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChangePassPage;
