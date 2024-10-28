import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../../assets/logo.jpg';
import { AuthContext } from '../../shared/context/auth-context';

const LoginPage = () => {
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Email không hợp lệ.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      auth.login(data.user.id)
      if (!response.ok) {
        setErrorMessage(data.msg || 'Đăng nhập thất bại');
        setIsLoading(false);
        return;
      }
      const tokenCreationTime = new Date().getTime();
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenCreationTime', tokenCreationTime);

      navigate('/home');
    } catch (error) {
      setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };


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
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="login-options">
            <Link className="forgot-password" to="/forgot-password">
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
