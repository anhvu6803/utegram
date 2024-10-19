import React from 'react';
import ProfileHeader from '../../components/ProfileComponent/ProfileHeader';
import ProfileTabs from '../../components/ProfileComponent/ProfileTab';
import './ProfilePage.css';
import OptionBar from '../../components/OptionBar/OptionBar'
const ProfilePage = () => {
  
  return (
    <div className='profile-page'>
        <OptionBar pages="profile"  />
        <ProfileHeader
          isUserProfile={true}
          author="@user"
          posts={45}
          followers={1200}
          following={300}
          bio="Tran Nhat Nguyen"
          profileImage="https://example.com/user-avatar.jpg"
        />
        <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
