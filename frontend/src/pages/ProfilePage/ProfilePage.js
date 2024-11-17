import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import ProfileHeader from '../../components/ProfileComponent/ProfileHeader';
import ProfileTabs from '../../components/ProfileComponent/ProfileTab';
import OptionBar from '../../components/OptionBar/OptionBar';
import './ProfilePage.css';

const ProfilePage = () => {
  
  return (
    <div className="profile-page">
      <OptionBar/> 
      <ProfileHeader/>
      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
