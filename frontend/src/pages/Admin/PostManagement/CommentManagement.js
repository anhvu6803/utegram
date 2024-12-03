import React, { useState, useEffect } from 'react';
import '../PostManagement/CommenManagement.css';
import AdminNavBar from '../../../components/AdminNavBar/AdminNavBar';
import CommentManagementTable from './CommentManagementTable';
import { Box } from '@mui/material';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/report/report-comment');
      const data = await response.json();
      setComments(data); 
    } catch (error) {
      console.error('Error fetching comment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();  
  }, []);

  return (
    <div>
      <AdminNavBar page={'comments'} />
      <div className="comment-container">
        <div className="comment-header">Xin chào, Quản trị viên</div>
        <div className="comment-message">Chúc bạn một ngày tốt lành!</div>
        <div className="management-title">Quản lý Bình luận</div>
        <Box component="form" sx={{ marginBottom: '20px' }}></Box>
        <CommentManagementTable comments={comments} fetchComments={fetchComments} loading={loading} />
      </div>
    </div>
  );
};

export default CommentManagement;
