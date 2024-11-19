import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './ProfileHeader.css';
import profilePic from '../../assets/avatar_default.jpg';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import OptionForm from '../OptionFormInProfile/OptionForm';
import ReportForm from '../OptionFormInProfile/ReportFromInProfile';
import NavbarSetting from '../OptionSetting/OptionSetting';
import { AuthContext } from '../../shared/context/auth-context';

const ProfileHeader = () => {
  const { username } = useParams(); 
  const [profile, setProfile] = useState(null); 
  const [isFollowing, setIsFollowing] = useState(false); 
  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [isReportMode, setIsReportMode] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);  // State for the settings modal
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
          const followResponse = await fetch(
            `http://localhost:5000/api/profile/follow-status/${username}?userId=${userId}`
          );
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
      const url = `http://localhost:5000/api/profile/follow/${profile._id}`;

      const response = await fetch(url, {
        method: 'PATCH', 
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

  const handleMetaClick = (type) => {
    if (type === 'posts') {
      navigate(`/profile/${username}/posts`);
    } else if (type === 'followers') {
      navigate(`/profile/${username}/followers`);
    } else if (type === 'following') {
      navigate(`/profile/${username}/following`);
    }
  };

  const formatNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    } else {
      return number;
    }
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
          onClick={() => navigate(`/profile/${username}`)}
          style={{ cursor: 'pointer' }}
          onError={(e) => (e.target.src = profilePic)}
        />
        <div className="profile-stats">
          <div className="profile-name">
            <h2 onClick={() => navigate(`/profile/${username}`)} style={{ cursor: 'pointer' }}>
              {profile.username || username}
            </h2>
            {isUserProfile ? (
              <button
                className="edit-profile-btn"
                onClick={() => setIsSettingModalOpen(true)} 
                aria-label="Edit Profile"
              >
                <SettingsOutlinedIcon className="edit-icon" />
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
                  onClick={() => navigate(`/messages`)}
                  disabled={!isFollowing}
                  style={{
                    backgroundColor: isFollowing ? '#0095f6' : '#EFEFEF',
                    color: isFollowing ? '#fff' : '#b0b0b0',
                    marginLeft: '10px',
                    cursor: isFollowing ? 'pointer' : 'not-allowed',
                  }}
                  aria-label="Send Message"
                >
                  Nhắn tin
                </button>
                <button
                  className="option-profile-btn"
                  onClick={() => setModalIsOpen(true)} 
                  aria-label="Profile Options"
                >
                  <MoreHorizOutlinedIcon className="option-icon" />
                </button>
              </>
            )}
          </div>
          <div className="profile-meta">
            <span style={{ marginRight: '30px' }}>
              <strong>{formatNumber(profile.posts)}</strong> bài viết
            </span>
            <span
              onClick={() => handleMetaClick('followers')}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              <strong>{formatNumber(profile.followers)}</strong> người theo dõi
            </span>
            <span
              onClick={() => handleMetaClick('following')}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              Đang theo dõi <strong>{formatNumber(profile.following)}</strong> người dùng
            </span>
          </div>
          <div className="profile-bio">
            <strong>{profile.bio}</strong>
          </div>
        </div>
      </div>

      {/* Modal for NavbarSetting (opened by Edit Profile button) */}
      <Modal
        open={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}  // Close the settings modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: '100vh', outline: 'none' }}
        >
          <NavbarSetting option="edit" />  {/* Display NavbarSetting when Edit Profile button is clicked */}
        </Box>
      </Modal>

      {/* Existing Modal for Report or Options */}
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
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
            <ReportForm handleClose={() => setModalIsOpen(false)} />
          ) : (
            <OptionForm closeModal={() => setModalIsOpen(false)} author={profile.username} />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
