import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import ProfileHeader from '../../components/ProfileComponent/ProfileHeader';
import ProfileTabs from '../../components/ProfileComponent/ProfileTab';
import OptionBar from '../../components/OptionBar/OptionBar';
import './ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams(); 
  const [profileData, setProfileData] = useState({
    isUserProfile: false,
    author: '',
    posts: 0,
    followers: 0,
    following: 0,
    bio: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/${username}`); 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const token = localStorage.getItem('token'); 
        let currentUsername = '';

        if (token) {
          const decodedToken = jwtDecode(token);
          currentUsername = decodedToken.username; 
        }

        const isUserProfile = currentUsername && currentUsername.trim().toLowerCase() === username.trim().toLowerCase(); 

        setProfileData({
          isUserProfile,
          author: data.username,
          posts: data.posts,
          followers: data.followers,
          following: data.following,
          bio: data.bio,
          profileImage: data.avatar
        });

        console.log('Profile data set:', {
          isUserProfile,
          author: data.username,
          posts: data.posts,
          followers: data.followers,
          following: data.following,
          bio: data.bio,
          profileImage: data.avatar
        });

      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [username]); 



  return (
    <div className="profile-page">
      <OptionBar pages={profileData.isUserProfile ? "profile" : undefined} /> 
      <ProfileHeader
        isUserProfile={profileData.isUserProfile}
        author={profileData.author}
        posts={profileData.posts}
        followers={profileData.followers}
        following={profileData.following}
        bio={profileData.bio}
        profileImage={profileData.profileImage}
      />
      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
