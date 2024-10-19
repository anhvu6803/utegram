import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './ProfileHeader.css';
import profilePic from '../../assets/avatar_default.jpg';
import imgsetting from '../../assets/img-setting.jpg';
import imgoption from '../../assets/img-option.jpg';
import OptionForm from '../OptionFormInProfile/OptionForm';
import ReportForm from '../OptionFormInProfile/ReportFromInProfile';

const ProfileHeader = ({ 
  isUserProfile, 
  author, 
  posts, 
  followers, 
  following, 
  bio, 
  profileImage 
}) => {
  const { username } = useParams(); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isReportMode, setIsReportMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); 
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/setting');
  };

  const handleOptionClick = () => {
    setModalIsOpen(true);
    setIsReportMode(false); 
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsReportMode(false); 
  };

  const openReportForm = () => {
    setIsReportMode(true);
  };

  const toggleToOptionForm = () => {
    setIsReportMode(false);
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing); // Toggle follow state
  };

  // Navigate to the user's profile page
  const handleNavigateToProfile = () => {
    navigate(`/profile/${username}`);
  };

  // New function to navigate to the message route
  const handleMessageClick = () => {
    navigate('/message');
  };

  return (
    <div className="profile-header">
      <div className="profile-info">
        <img 
          src={profileImage || profilePic} 
          alt="Profile" 
          className="profile-picture" 
          onClick={handleNavigateToProfile} // Navigate on clicking profile picture
          style={{ cursor: 'pointer' }} // Add cursor pointer
          onError={(e) => e.target.src = profilePic} 
        />
        <div className="profile-stats">
          <div className="profile-name">
            <h2 onClick={handleNavigateToProfile} style={{ cursor: 'pointer' }}>
              {username}
            </h2>
            {isUserProfile ? (
              <button 
                className="edit-profile-btn" 
                onClick={handleEditClick} 
                aria-label="Edit Profile"
              >
                <img src={imgsetting} alt="Edit" className="edit-icon" />
              </button>
            ) : (
              <>
                <button 
                  className="follow-btn" 
                  onClick={handleFollowClick}
                  style={{
                    backgroundColor: isFollowing ? '#EFEFEF' : '#0095f6',
                    color: isFollowing ? '#262626' : '#fff',
                  }}
                >
                  {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                </button>
                
                <button 
                  className="message-btn" 
                  onClick={handleMessageClick}
                  style={{
                    backgroundColor: '#EFEFEF',
                    color: '#262626',
                    marginLeft: '10px'
                  }}
                >
                  Nhắn tin
                </button>

                <button 
                  className="option-profile-btn" 
                  onClick={handleOptionClick} 
                  aria-label="Profile Options"
                >
                  <img src={imgoption} alt="Option" className="option-icon" />
                </button>
              </>
            )}
          </div>
          <div className="profile-meta">
            <span><strong>{posts}</strong> posts</span>
            <span><strong>{followers}</strong> followers</span>
            <span><strong>{following}</strong> following</span>
          </div>
          <div className="profile-bio">
            <strong>{bio}</strong>
          </div>
        </div>
      </div>

      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: '100vh', outline: 'none' }}
        >
          {isReportMode ? (
            <ReportForm 
              handleClose={closeModal} 
              toggleToOptionForm={toggleToOptionForm}  
            />
          ) : (
            <OptionForm 
              closeModal={closeModal} 
              author={author} 
              openReportForm={openReportForm}  
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
