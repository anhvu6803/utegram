import React from 'react';
import ProfileHeader from '../../components/ProfileComponent/ProfileHeader';
import ProfileTabs from '../../components/ProfileComponent/ProfileTab';
import './ProfilePage.css';
import OptionBar from '../../components/OptionBar/OptionBar'
const ProfilePage = () => {
  return (
    <div className='profile-page'>
        <OptionBar></OptionBar>
        <ProfileHeader isUserProfile={true} />  
        <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
