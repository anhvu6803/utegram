import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './SignUpPage.css';
import logo from '../../assets/logo.jpg'; 
import InputBornDay from './InputBornDay';  

const SignupPage = () => {
  const [showBornDay, setShowBornDay] = useState(false);  
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    fullname: '',
    username: '',
    bornDay: '', 
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleNextStep = (event) => {
    event.preventDefault();
    setShowBornDay(true); 
  };

  const handleRegisterComplete = async ({ bornDay }) => {
    const completeData = { ...userData, bornDay };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData), 
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/confirm-code', { state: { email: userData.email } });
      } else {
        alert(data.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="signup-page">
      <div className="top-left-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="signup-container">
        {showBornDay ? (  
          <InputBornDay onRegisterComplete={handleRegisterComplete} /> 
        ) : (
          <div className="signup-box">
            <h1 className="logo">UTEGRAM</h1>
            <div className="signup-title">Đăng ký để xem ảnh và video từ bạn bè.</div>
            <form className="signup-form" onSubmit={handleNextStep}>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  required
                  value={userData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <input
                  type="text" 
                  name="fullname"
                  placeholder="Tên đầy đủ"
                  required
                  value={userData.fullname}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"  
                  name="username"
                  placeholder="Tên người dùng"
                  required
                  value={userData.username}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="signup-btn">
                Tiếp tục
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
