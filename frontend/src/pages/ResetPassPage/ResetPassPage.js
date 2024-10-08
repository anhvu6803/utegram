import React from 'react';
import './ResetPassPage.css';

const ResetPassPage = () => {
  return (
    <>
      <header className="header">
        <h1 className="logo-text">UTEGRAM</h1>
        <div className="button-group">
          <button className="btn btn-primary">Đăng nhập</button>
          <button className="btn btn-primary-signup">Đăng ký</button>
        </div>
      </header>
      <div className="resetpass-container">
        <div className="resetpass-box">
          <h2 className="input-title">Tạo mật khẩu mạnh</h2>
          <p className="text-description">
            Mật khẩu của bạn phải có ít nhất 6 ký tự, bao gồm cả số, chữ cái và ký tự đặc biệt (!$@%).
          </p>
          <form className="resetpass-form">
            <div className="input-group">
              <input
                type="password"
                name="newpass"
                placeholder="Mật khẩu mới"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="renewpass"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="submit"
                className="reset-btn"
                aria-label="Đặt lại mật khẩu"
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default ResetPassPage;
