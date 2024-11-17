import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './ProfileHeader.css';
import profilePic from '../../assets/avatar_default.jpg';
import imgsetting from '../../assets/img-setting.jpg';
import imgoption from '../../assets/img-option.jpg';
import OptionForm from '../OptionFormInProfile/OptionForm';
import ReportForm from '../OptionFormInProfile/ReportFromInProfile';
import { AuthContext } from '../../shared/context/auth-context';

const ProfileHeader = () => {
  const { username } = useParams(); 
  const [profile, setProfile] = useState(null); 
  const [isFollowing, setIsFollowing] = useState(false); 
  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [isReportMode, setIsReportMode] = useState(false);
  const navigate = useNavigate();

  const auth = useContext(AuthContext); 
  const userId = auth.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        const data = await response.json();
  
        if (response.ok) {
          setProfile(data); 
          const followResponse = await fetch(`http://localhost:5000/api/profile/follow-status/${username}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), 
          });
          const followData = await followResponse.json();
  
          if (followResponse.ok) {
            setIsFollowing(followData.isFollowing); 
          } else {
            console.error('Error checking follow status:', followData.error);
          }
        } else {
          console.error('Error fetching profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfile(); 
  }, [username, userId]); 

  const handleFollowClick = async () => {
    try {
      const url = isFollowing
        ? `http://localhost:5000/api/profile/unfollow/${username}`
        : `http://localhost:5000/api/profile/follow/${username}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), 
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followers: isFollowing ? prevProfile.followers - 1 : prevProfile.followers + 1,
        }));
      } else {
        console.error('Error toggling follow status:', data.error);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleEditClick = () => navigate('/accounts/edit');
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
  const handleNavigateToProfile = () => navigate(`/profile/${username}`);
  const handleMessageClick = () => {
    navigate(`/messages`); 
  };

  if (!profile) {
    return <p>Loading...</p>; 
  }

  const isUserProfile = userId === profile._id; 

  return (
    <div className="profile-header">
      <div className="profile-info">
        <img
          src={profile.avatar || profilePic}
          alt="Profile"
          className="profile-picture"
          onClick={handleNavigateToProfile}
          style={{ cursor: 'pointer' }}
          onError={(e) => (e.target.src = profilePic)}
        />
        <div className="profile-stats">
          <div className="profile-name">
            <h2 onClick={handleNavigateToProfile} style={{ cursor: 'pointer' }}>
              {profile.username || username}
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
                  aria-label={isFollowing ? 'Unfollow' : 'Follow'}
                >
                  {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                </button>
                <button
                  className="message-btn"
                  onClick={handleMessageClick}
                  disabled={!isFollowing}  // Disable the button if not following
                  style={{
                    backgroundColor: isFollowing ? '#0095f6' : '#EFEFEF', // Highlight when following
                    color: isFollowing ? '#fff' : '#b0b0b0', // Change text color when not following
                    marginLeft: '10px',
                    cursor: isFollowing ? 'pointer' : 'not-allowed', // Pointer cursor when active
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
            <span>
              <strong>{profile.posts}</strong> bài viết
            </span>
            <span>
              <strong>{profile.followers}</strong> người theo dõi
            </span>
            <span>
              <strong>{profile.following}</strong> đang theo dõi
            </span>
          </div>
          <div className="profile-bio">
            <strong>{profile.bio}</strong>
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
            <ReportForm handleClose={closeModal} toggleToOptionForm={toggleToOptionForm} />
          ) : (
            <OptionForm closeModal={closeModal} author={profile.username} openReportForm={openReportForm} />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileHeader;

