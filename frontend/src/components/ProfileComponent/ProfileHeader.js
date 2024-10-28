import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './ProfileHeader.css';
import profilePic from '../../assets/avatar_default.jpg';
import imgsetting from '../../assets/img-setting.jpg';
import imgoption from '../../assets/img-option.jpg';
import OptionForm from '../OptionFormInProfile/OptionForm';
import ReportForm from '../OptionFormInProfile/ReportFromInProfile';
import axios from 'axios';

const ProfileHeader = ({ 
  isUserProfile, 
  author = 'User', 
  posts = 0, 
  followers = 0, 
  following = 0, 
  bio = '', 
  profileImage 
}) => {
  const { username } = useParams(); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isReportMode, setIsReportMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(`/api/follow-status/${username}`); 
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    checkFollowingStatus();
  }, [username]);

  const handleEditClick = () => navigate('/setting');
  
  const handleOptionClick = () => {
    setModalIsOpen(true);
    setIsReportMode(false); 
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsReportMode(false); 
  };

  const openReportForm = () => setIsReportMode(true);
  
  const toggleToOptionForm = () => setIsReportMode(false);

  const handleFollowClick = async () => {
    try {
      // await axios.post(`/api/follow/${username}`);  
      setIsFollowing(!isFollowing); 
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleNavigateToProfile = () => navigate(`/profile/${username}`);

  const handleMessageClick = () => navigate('/message');

  return (
    <div className="profile-header">
      <div className="profile-info">
        <img 
          src={profileImage || profilePic} 
          alt="Profile" 
          className="profile-picture" 
          onClick={handleNavigateToProfile}
          style={{ cursor: 'pointer' }}
          onError={(e) => e.target.src = profilePic} 
        />
        <div className="profile-stats">
          <div className="profile-name">
            <h2 onClick={handleNavigateToProfile} style={{ cursor: 'pointer' }}>
              {author || username}
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
                  aria-label={isFollowing ? "Unfollow" : "Follow"}
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
                  aria-label="Send Message"
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
            <span><strong>{posts}</strong> bài viết</span>
            <span><strong>{followers}</strong> người theo dõi</span>
            <span><strong>{following}</strong> đang theo dõi</span>
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
