import React, { useState, useEffect } from 'react';
import birthdayCake from '../../assets/birthdaycake.jpg';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const InputBornDay = ({ onRegisterComplete, onBack }) => {
  const location = useLocation(); 
  const { bornDay } = location.state || {}; 

  const initialDate = bornDay ? new Date(bornDay) : null;
  const [day, setDay] = useState(initialDate ? initialDate.getDate() : ''); 
  const [month, setMonth] = useState(initialDate ? initialDate.getMonth() + 1 : ''); 
  const [year, setYear] = useState(initialDate ? initialDate.getFullYear() : ''); 

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [validDays, setValidDays] = useState([]);

  useEffect(() => {
    if (month && year) {
      const totalDaysInMonth = new Date(year, month, 0).getDate();
      setValidDays(Array.from({ length: totalDaysInMonth }, (_, i) => i + 1));
      if (day > totalDaysInMonth) {
        setDay('');
      }
    }
    else {
      setValidDays([]);
      setDay('');
    }
  }, [month, year]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (day && month && year) {
      const bornDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onRegisterComplete({ bornDay }); 
    }
  };

  return (
    <div className="input-born-page">
      <div className="login-container">
        <div className="login-box">
          <div>
            <img src={birthdayCake} alt="Birthday Cake" className="img-cake" />
          </div>
          <div className="input-born-title">Thêm ngày sinh</div>
          <form onSubmit={handleSubmit}>
            <div className="dob-selectors">
              <div className="dob-select-box">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="dob-select" disabled={!validDays.length}>
                  <option value="">Ngày</option>
                  {validDays.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="dob-select-box">
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="dob-select">
                  <option value="">Tháng</option>
                  {months.map((m, index) => (
                    <option key={index} value={index + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="dob-select-box">
                <select value={year} onChange={(e) => setYear(e.target.value)} className="dob-select">
                  <option value="">Năm</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="continue-btn" disabled={!day || !month || !year}>
              Tiếp tục
            </button>
          </form>
          <div className="back-text">
            <Link to='/signup' className="back-link">Quay lại</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBornDay;
