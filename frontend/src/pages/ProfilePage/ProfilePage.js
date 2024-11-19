import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import ProfileHeader from '../../components/ProfileComponent/ProfileHeader';
import ProfileTabs from '../../components/ProfileComponent/ProfileTab';
import OptionBar from '../../components/OptionBar/OptionBar';
import './ProfilePage.css';

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const { username } = useParams();
  const navigate = useNavigate();

  const [isValidUsername, setIsValidUsername] = useState(null); 
  const [profileUserId, setProfileUserId] = useState(null); 

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/check-username/${username}`);
        if (response.ok) {
          const data = await response.json();
          setIsValidUsername(true); 
          setProfileUserId(data.userId); 
        } else {
          setIsValidUsername(false); 
        }
      } catch (err) {
        setIsValidUsername(false);
      }
    };

    if (username) {
      checkUsername();
    } else {
      setIsValidUsername(false); 
    }
  }, [username]);

  if (isValidUsername === null) {
    return <div>Loading...</div>;
  }

  if (!isValidUsername) {
    return (
      <div className="error-page">
        <div className="error-container">
          <h2>Rất tiếc, trang này hiện không khả dụng.</h2>
          <p>
            Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ.{' '}
            <a href="/home" className="back-link">Quay lại trang chủ</a>.
          </p>
        </div>
      </div>
    );
  }

  const isOwner = auth.userId === profileUserId;
  console.log(isOwner);

  return (
    <div className="profile-page">
      <OptionBar page={isOwner ? 'profile' : undefined} /> 
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
