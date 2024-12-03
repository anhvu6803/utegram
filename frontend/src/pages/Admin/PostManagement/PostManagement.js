import React, { useState, useEffect } from 'react';
import './PostManagement.css';
import AdminNavBar from '../../../components/AdminNavBar/AdminNavBar';
import PostManagementTable from './PostManagementTable';
import { TextField, Box, InputAdornment, IconButton, Popover, Typography, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const PostManagement = () => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/report/report-post');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    console.log('Sorting by:', value);
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleNotificationClick = () => {
    setHasNotifications(false);
    console.log('Notifications clicked');
  };

  return (
    <div>
      <AdminNavBar page={'posts'} />
      <div className="user-container">
        <div className="user-header">Xin chào, Admin</div>
        <div className="user-message">Chúc một ngày tốt lành</div>
        <div className="management-title">Quản lý bài viết</div>
        <Box component="form" sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        </Box>
        <PostManagementTable posts={posts} fetchPosts={fetchPosts} />
      </div>
    </div>
  );
};

export default PostManagement;
