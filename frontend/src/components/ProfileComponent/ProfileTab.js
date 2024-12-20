import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ProfileTab.css';
import GridOnIcon from '@mui/icons-material/GridOn';  
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';  
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import ProfilePost from './Post/ProfilePost';
import ProfileVideo from './Video/ProfileVideo';
import ProfileBookmark from './Bookmark/ProfileBookmark'; 
const PostsContent = () => (
    <ProfilePost  />
);

const VideosContent = () => (
  <ProfileVideo></ProfileVideo>
);

const SavedContent = () => (
  <ProfileBookmark />
);

const ProfileTabs = () => {
  const location = useLocation();
  const tab = location.state?.tab || 'posts';
  
  const [activeTab, setActiveTab] = useState(tab);

  return (
    <div>
      <div className="profile-tabs">
        <div 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <GridOnIcon fontSize="large" />
          <span>Hình Ảnh</span>
        </div>
        <div 
          className={`tab ${activeTab === 'videos' ? 'active' : ''}`} 
          onClick={() => setActiveTab('videos')}
        >
          <VideoLibraryIcon fontSize="large" />
          <span>Video</span>
        </div>
        <div 
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`} 
          onClick={() => setActiveTab('saved')}
        >
          <TurnedInNotIcon fontSize="large" />
          <span>Đã Lưu</span>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === 'posts' && <PostsContent />}
        {activeTab === 'videos' && <VideosContent />}
        {activeTab === 'saved' && <SavedContent />}
      </div>
    </div>
  );
};

export default ProfileTabs;
