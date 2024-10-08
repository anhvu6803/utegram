import React from 'react';
import { Link } from 'react-router-dom';
import avatardefault from '../../assets/avatar_default.jpg';
import './LoginAsUserToChangePassPage.css';
const LoginAsUserToChangePassPage = () => {
    const username="nhatnguyen";
  return (     
      <div className="changepass-container">
        <div className="changepass-box">
          <img src={avatardefault} alt="Change Password" className="img-change" />
          <h1 className="input-title">{username}</h1>
          <form className="changepass-form">
            <div className="input-group">
              <input
                type="text"
                name="newpass"
                placeholder="Mật khẩu mới"
                required
                className="input-field"
              />
              <input
                type="text"
                name="confirmpass"
                placeholder="Nhập lại mật khẩu mới"
                required
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className="send-link-btn"
              aria-label="Gửi liên kết"
            >
              Đổi mật khẩu
            </button>
          </form>
          <div className="signup-text">
            <Link to="/signup" className="signup-link">
              Bỏ qua
            </Link>
          </div>
        </div>
      </div>
  );
};
export default LoginAsUserToChangePassPage;
