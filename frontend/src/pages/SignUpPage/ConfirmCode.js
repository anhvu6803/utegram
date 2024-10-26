import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import imgemail from '../../assets/email.jpg';
import './SignUpPage.css';

const ConfirmCode = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { email } = location.state || { email: '' }; 
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: confirmationCode }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/');  
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"  
                name="confirmationCode"
                placeholder="Nhập mã xác nhận"
                required
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="continue-btn"
              aria-label="Tiếp tục"
            >
              Tiếp tục
            </button>
          </form>
          <div className="back-text">
            <Link to='/signup' className="back-link">
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCode;
