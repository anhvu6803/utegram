import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SetNewPasswordPage.css';

const SetNewPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';


  const validatePassword = (password) => {
    const passwordLengthCheck = password.length >= 8;
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return passwordLengthCheck && specialCharCheck;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
      setIsError(true);
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Mật khẩu phải có ít nhất 8 ký tự và 1 ký tự đặc biệt!');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
        setIsError(false);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(data.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại!');
      setIsError(true);
    }
  };

  return (
    <div className="setnewpassword-page">
      <div className="setnewpassword-container">
        <div className="setnewpassword-box">
          <h2 className="input-title">Đặt lại mật khẩu mới</h2>
          <p className="text-description">
            Nhập mã xác nhận, mật khẩu mới và xác nhận mật khẩu.
          </p>
          <form className="setnewpassword-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="code"
                placeholder="Mã xác nhận"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message && (
              <p className={isError ? 'error-message' : 'success-message'}>
                {message}
              </p>
            )}
            <button type="submit" className="reset-btn">
              Cập nhật mật khẩu
            </button>
          </form>

          <button 
            className="back-btn"
            onClick={() => navigate('/login')}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
