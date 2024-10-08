import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import birthdayCake from '../../assets/birthdaycake.jpg';
import ConfirmCode from './ConfirmCode';

const InputBornDay = () => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (day && month && year) {
      console.log(`Ngày sinh: ${day}/${month}/${year}`);
      setIsSubmitted(true); 
    }
  };

  if (isSubmitted) {
    return <ConfirmCode />;
  }

  return (
    <div className="input-born-page">
    <div className="login-container">
      <div className="login-box">
        <div>
          <img src={birthdayCake} alt="Birthday Cake" className="img-cake" />
        </div>
        <div className="input-born-title">Thêm ngày sinh</div>
        <div className="text-born">
          Thông tin này sẽ không hiển thị trên trang cá nhân công khai của bạn.
        </div>
        <div className="text-born">
          Hãy thêm ngày sinh của chính bạn, dù đây là tài khoản dành cho doanh nghiệp, thú cưng hay bất cứ điều gì khác.
        </div>
        <form onSubmit={handleSubmit}> 
          <div className="dob-selectors">
            <div className="dob-select-box">
              <select value={day} onChange={(e) => setDay(e.target.value)} className="dob-select">
                <option value="">Ngày</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="dob-select-box">
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="dob-select">
                <option value="">Tháng</option>
                {months.map((m, index) => (
                  <option key={index} value={index + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="dob-select-box">
              <select value={year} onChange={(e) => setYear(e.target.value)} className="dob-select">
                <option value="">Năm</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit" 
            className="continue-btn"
            aria-label="Tiếp tục"
            disabled={!day || !month || !year} 
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
      <div className="back-login-box">
        <div className="login-option-box">
          Bạn đã có tài khoản?{' '}
          <Link to="/" className="login-link">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default InputBornDay;
