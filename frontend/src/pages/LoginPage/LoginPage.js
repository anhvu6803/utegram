import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; 
import logo from '../../assets/logo.jpg';

const LoginPage = () => {
  return (
    <div className="login-page">  
      <div className="top-left-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="logo">
            <h1>UTEGRAM</h1>
          </div>
          <form className="login-form">
            <div className="input-group">
              <input
                type="text"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Đăng nhập
            </button>
          </form>
          <div className="login-options">
            <Link className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>
        </div>
        <div className="signup-group">
          Bạn chưa có tài khoản?{' '}
          <Link to="/signup" className="signup-link">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
