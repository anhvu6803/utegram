import React from 'react';
import './ProfileHeader.css';
import profilePic from '../../assets/avatar_default.jpg';
import imgsetting from '../../assets/img-setting.jpg';
import imgoption from '../../assets/img-option.jpg';  

const ProfileHeader = ({ isUserProfile }) => {
  return (
    <div className="profile-header">
      <div className="profile-info">
        <img src={profilePic} alt="Profile" className="profile-picture" />
        <div className="profile-stats">
          <div className="profile-name">
            <h2>nhatnguyen.hcmute</h2>
            {isUserProfile ? (
              <button className='edit-profile-btn'>
                <img src={imgsetting} alt="Edit" className="edit-icon" />
              </button>
            ) : (
              <button className='option-profile-btn'>
                <img src={imgoption} alt="Option" className="option-icon" />
              </button>
            )}
          </div>
          <div className="profile-meta">
            <span><strong>75</strong> posts</span>
            <span><strong>350</strong> followers</span>
            <span><strong>200</strong> following</span>
          </div>
          <div className="profile-bio">
            <strong>Trần Nhật Nguyên</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
