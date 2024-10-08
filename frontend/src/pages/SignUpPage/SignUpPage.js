import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUpPage.css';
import logo from '../../assets/logo.jpg'; 
import InputBornDay from './InputBornDay';  

const SignupPage = () => {
  const [showBornDay, setShowBornDay] = useState(false);  

  const handleSignUp = (event) => {
    event.preventDefault();  
    setShowBornDay(true);    
  };

  return (
    <div className="signup-page">
      <div className="top-left-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="signup-container">
        {showBornDay ? (  
          <InputBornDay />
        ) : (
          <div className="signup-box">
            <h1 className="logo">UTEGRAM</h1>
            <div className="signup-title">Đăng ký để xem ảnh và video từ bạn bè.</div>
            <form className="signup-form" onSubmit={handleSignUp}>
              <div className="input-group">
                <input
                  type="email"
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
              <div className="input-group">
                <input
                  type="text" 
                  name="fullname"
                  placeholder="Tên đầy đủ"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"  
                  name="username"
                  placeholder="Tên người dùng"
                  required
                />
              </div>
              <button type="submit" className="signup-btn">
                Đăng ký
              </button>
            </form>
          </div>
        )}
        {!showBornDay && (  
          <div className="back-login-box">
            <div className="login-option-box">
              Bạn đã có tài khoản?{' '}
              <Link to="/" className="login-link">
                Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
