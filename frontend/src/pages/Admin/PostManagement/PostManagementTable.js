import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Modal,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';  
import Cookies from 'js-cookie'; 
import { toast } from 'react-toastify';

const PostManagementTable = ({ posts, fetchPosts }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [blockedPostIds, setBlockedPostIds] = useState(new Set());
  const [resolvedPostIds, setResolvedPostIds] = useState(new Set());

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    borderRadius: '8px',  
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', 
  };

  const handleViewReports = (reports) => {
    if (!reports || reports.length === 0) {
      setModalContent('Không có báo cáo cho bài viết này.');
      setOpenModal(true);
      return;
    }
  
    const reportDetails = reports
      .map(
        (report, index) =>
          `#${index + 1}:Lý do: ${report.reason}\nNgười gửi: ${
            report.senderId?.username || 'N/A'
          }\n`
      )
      .join('\n'); 
  
    setModalContent(reportDetails);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleBlockPost = async (postId) => {
    const token = Cookies.get('accessToken'); 

    if (!token) {
      toast.error('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    if (blockedPostIds.has(postId)) {
      return;
    }

    setLoading(true);
    setBlockedPostIds((prev) => new Set(prev).add(postId));

    try {
      const response = await fetch(`http://localhost:5000/api/admin/ban-post/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể chặn bài viết. Vui lòng thử lại.');
      }

      toast.success('Bài viết đã bị chặn thành công!');
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi chặn bài viết:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi chặn bài viết.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolvePost = async (postId) => {
    const token = Cookies.get('accessToken');

    if (!token) {
      toast.error('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    if (resolvedPostIds.has(postId)) {
      return;
    }

    setLoading(true);
    setResolvedPostIds((prev) => new Set(prev).add(postId));

    try {
      const response = await fetch(`http://localhost:5000/api/admin/resolve/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xử lý bài viết. Vui lòng thử lại.');
      }

      toast.success('Bài viết đã được xử lý thành công!');
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi xử lý bài viết:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi xử lý bài viết.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ bgcolor: '#53BDEB' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Loại</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Tác giả</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Bình luận</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Lượt thích</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Báo cáo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              const latestReport = post.reports?.[post.reports.length - 1];
              const reportStatus = latestReport ? latestReport.status : 'Chưa có báo cáo';

              return (
                <TableRow key={post._id}>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {post.type === 'image' ? (
                      <CropOriginalIcon sx={{ fontSize: 35 }} />
                    ) : (
                      <SmartDisplayIcon sx={{ fontSize: 35 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {post.author?.username || 'Ẩn danh'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {post.author?.email || 'Không có email'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {post.comments?.length || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {post.likes?.length || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {post.reports?.length || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {reportStatus === 'resolved' ? (
                      <span style={{ color: 'green' }}>Đã xử lý</span>
                    ) : reportStatus === 'pending' ? (
                      <span style={{ color: 'orange' }}>Chưa xử lý</span>
                    ) : (
                      <span>Không có báo cáo</span>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: '#0095F6',
                            color: 'white',
                            borderRadius: '8px',
                            height: '30px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            marginRight: '10px', 
                          }}
                        >
                          Xem
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        onClick={() => handleViewReports(post.reports || [])}
                        sx={{
                          bgcolor: '#FF8C00',
                          color: 'white',
                          borderRadius: '8px',
                          height: '30px',
                          marginRight: '10px', 
                          fontWeight: 'bold',
                          fontSize: '12px',
                        }}
                      >
                        Xem report
                      </Button>
                      <BlockIcon
                        sx={{
                          marginRight: '10px',
                          cursor: 'pointer',
                          color: 'red',
                          fontSize: 30,
                        }}
                        onClick={() => handleBlockPost(post._id)}
                        disabled={blockedPostIds.has(post._id)}
                      />
                      {post.reports && post.reports.length > 0 && (
                        <CheckIcon
                          sx={{
                            marginRight: '10px',
                            cursor: 'pointer',
                            color: 'green',
                            fontSize: 30,
                          }}
                          onClick={() => handleResolvePost(post._id)}
                          disabled={resolvedPostIds.has(post._id)}
                        />
                      )}
                      {loading && (
                        <CircularProgress size={24} sx={{ position: 'absolute', right: 10, top: 10 }} />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                Không có bài viết nào để hiển thị
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Danh sách báo cáo
            </Typography>
            <IconButton onClick={handleCloseModal} sx={{ color: 'gray' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
            {modalContent}
          </Typography>
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default PostManagementTable;
