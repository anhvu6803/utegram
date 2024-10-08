import React  from 'react';
import { Link } from 'react-router-dom';
import './LoggedPage.css'; 
import logo from '../../assets/logo.jpg';
import avatar from '../../assets/avatar_default.jpg';
const LoggedPage = () => {
    const username='nhatnguyen';
  return (
    <div>
      <div className="top-left-logo">
        <img src={logo} alt="Logo"/>
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="logo">
            <h1>UTEGRAM</h1>
          </div>
          <div>
            <img src={avatar} alt="Avatar" className="avatar" />
          </div>
          <form  className="login-form">
            <button type="submit" className="login-btn">
              Tiếp tục dưới tên {username}
            </button>
          </form>
          <div className="signup-group">
            Không phải {username}?{' '}
            <Link to="/" className="signup-link">
              Chuyển tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoggedPage;
