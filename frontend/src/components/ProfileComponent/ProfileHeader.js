import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './ProfileHeader.css';
import profilePic from '../../assets/user.png';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { AuthContext } from '../../shared/context/auth-context';
import MoreForm from '../MoreForm/MoreForm'
import ListFollow from '../ProfileComponent/ListFollow';

const ProfileHeader = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [modalIsOpen, setOpenModal] = useState(false);
  const [modalOptionIsOpen, setIsOptionModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
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

  const handleFollowersClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/followers/${username}`);
      const data = await response.json();

      if (response.ok) {
        const enrichedFollowers = await Promise.all(
          data.followers.map(async (follower) => {
            const followStatusResponse = await fetch(
              `http://localhost:5000/api/profile/follow-status/${follower.username}?userId=${userId}`
            );
            const followStatusData = await followStatusResponse.json();
            return {
              ...follower,
              isFollowing: followStatusData.isFollowing,
            };
          })
        );

        setFollowers(enrichedFollowers);
        setIsFollowersModalOpen(true);
      } else {
        console.error('Error fetching followers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };
  const handleFollowingClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/following/${username}`);
      const data = await response.json();

      if (response.ok) {
        const enrichedFollowing = await Promise.all(
          data.followings.map(async (followingUser) => {
            const followStatusResponse = await fetch(
              `http://localhost:5000/api/profile/follow-status/${followingUser.username}?userId=${userId}`
            );
            const followStatusData = await followStatusResponse.json();
            return {
              ...followingUser,
              isFollowing: followStatusData.isFollowing,
            };
          })
        );

        setFollowing(enrichedFollowing);
        setIsFollowingModalOpen(true);
      } else {
        console.error('Error fetching following:', data.error);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
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
  const closeModal = () => {
    setOpenModal(false);
  }
  const closeOptionModal = () => {
    setIsOptionModalOpen(false);
  }

  return (
    <div className="profile-header">
      <div className="profile-info">
        <img
          src={profile?.avatar || profilePic}
          alt="Profile"
          className="profile-picture"
          onClick={() => navigate(`/profile/${username}`)}
          style={{ cursor: 'pointer' }}
          onError={(e) => (e.target.src = profilePic)}
        />
        <div className="profile-stats">
          <div className="profile-name">
            <h2 onClick={() => navigate(`/profile/${username}`)} style={{ cursor: 'pointer' }}>
              {profile?.username || username}
            </h2>

            {isUserProfile ? (
              <button
                className="edit-profile-btn"
                onClick={() => setOpenModal(true)}
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
                  onClick={() => navigate(`/messages/${profile.username}`)}  // Navigate to the messages page for this user
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
                  onClick={() => setIsOptionModalOpen(true)}
                  aria-label="Profile Options"
                >
                  <MoreHorizOutlinedIcon className="option-icon" />
                </button>
              </>
            )}
          </div>

          <span style={{ color: 'black', marginBottom: '20px' }}>{'Ngày sinh: ' + profile?.bornDay}</span>

          <div className="profile-meta">
            <span style={{ marginRight: '30px' }}>
              <strong>{formatNumber(profile.posts)}</strong> bài viết
            </span>
            <span
              onClick={handleFollowersClick}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              <strong>{formatNumber(profile.followers)}</strong> người theo dõi
            </span>
            <span
              onClick={handleFollowingClick}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              Đang theo dõi <strong>{formatNumber(profile.following)}</strong> người dùng
            </span>
          </div>

          <span style={{ fontSize: 15, fontWeight: 'bold' }}>{profile.fullname}</span>

          <span style={{ fontSize: 15, marginBottom: '30px' }}>{profile.bio}</span>

        </div>
      </div>

      {/* Followers Modal */}
      <Modal
        open={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        aria-labelledby="followers-modal-title"
        aria-describedby="followers-modal-description"
      >
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <ListFollow listUser={followers} closeModal={() => setIsFollowersModalOpen(false)} modalType="followers" />
        </Box>
      </Modal>


      <Modal
        open={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        aria-labelledby="following-modal-title"
        aria-describedby="following-modal-description"
      >
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <ListFollow listUser={following} closeModal={() => setIsFollowingModalOpen(false)} modalType="followings" />
        </Box>
      </Modal>

      {/* Settings Modal */}
      <Modal open={modalIsOpen} onClose={closeModal} >
        <Box sx={{
          height: '100%',
          display: "flex", justifyContent: "center", marginTop: "100px",
          overflow: 'auto'
        }}
        >
          <MoreForm
            closeModal={closeModal}
            author={profile}
            type={"user"}

          />
        </Box>
      </Modal>


      <Modal open={modalOptionIsOpen} onClose={closeOptionModal} >
        <Box sx={{
          height: '100%',
          display: "flex", justifyContent: "center", alignItems: "center",
          overflow: 'auto'
        }}
        >
          <MoreForm
            closeModal={closeOptionModal}
            author={profile}
            type={"user"}
            itemId={profile._id}
          />
        </Box>
      </Modal>


    </div>
  );
};

export default ProfileHeader;
