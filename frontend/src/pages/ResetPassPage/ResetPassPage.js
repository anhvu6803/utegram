import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassPage.css';

const ResetPassPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setMessage('Vui lòng nhập email hợp lệ!');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-password-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
        setIsError(false);
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
    <>
      <header className="header">
        <h1 className="logo-text">UTEGRAM</h1>
        <div className="button-group">
         
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        </div>
      </header>
      <div className="resetpass-container">
        <div className="resetpass-box">
          <h2 className="input-title">Nhập email để đặt lại mật khẩu</h2>
          <p className="text-description">
            Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
          <form className="resetpass-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {message && (
              <p className={isError ? 'error-message' : 'success-message'}>
                {message}
              </p>
            )}
            <button type="submit" className="reset-btn">
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassPage;
