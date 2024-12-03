import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Modal,
  Box,
  Typography,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const CommentManagementTable = ({ comments, fetchComments, loading }) => {
  const [checkedComments, setCheckedComments] = useState(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleCheck = async (commentId) => {
    const token = Cookies.get('accessToken');
    if (!token) {
      toast.error('Bạn chưa đăng nhập hoặc phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/report/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa báo cáo bình luận. Vui lòng thử lại.');
      }

      toast.success('Đã xóa báo cáo của bình luận!');
      fetchComments();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi xóa báo cáo.');
    }
  };

  const handleBlockComment = async (commentId) => {
    const token = Cookies.get('accessToken');
    if (!token) {
      toast.error('Bạn chưa đăng nhập hoặc phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/deletecomment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa bình luận. Vui lòng thử lại.');
      }

      toast.success('Bình luận đã bị xóa!');
      fetchComments(); 
    } catch (error) {
      console.error('Error blocking comment:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi xóa bình luận.');
    }
  };

  const handleViewReport = (reports) => {
    if (!reports || reports.length === 0) {
      setModalContent('Không có báo cáo cho bình luận này.');
      setOpenModal(true);
      return;
    }

    const reportDetails = reports.map((report, index) => {
      return `Báo cáo ${index + 1}:
        Lý do: ${report.reason}
        Người báo cáo: ${report.reporter?.username || 'Ẩn danh'}
        Email: ${report.reporter?.email || 'Không có email'}
      `;
    }).join('\n\n');

    setModalContent(reportDetails);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ bgcolor: '#53BDEB' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Bình luận</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Tác giả</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center' }}>Đang tải...</TableCell>
            </TableRow>
          ) : comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center' }}>Không có bình luận nào để hiển thị</TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.commentId}>
                <TableCell sx={{ textAlign: 'center' }}>{comment.commentText}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{comment.author?.username || 'Ẩn danh'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{comment.author?.email || 'Không có email'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    sx={{
                      bgcolor: '#0095F6',
                      color: 'white',
                      borderRadius: '8px',
                      height: '30px',
                      marginRight: '10px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                    onClick={() => handleViewReport(comment.reports)} 
                  >
                    Xem báo cáo
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/post/${comment.post.id}`}
                    sx={{
                      color: '#0095F6',
                      borderColor: '#0095F6',
                      borderRadius: '8px',
                      height: '30px',
                      marginRight: '10px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  >
                    Xem bài viết
                  </Button>
                  <IconButton
                    sx={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => handleBlockComment(comment.commentId)}
                  >
                    <BlockIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: 'green', cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => handleCheck(comment.commentId)} 
                  >
                    <CheckIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
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
        }}>
          <Typography variant="h6">Chi tiết báo cáo</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
            {modalContent}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
            sx={{ marginTop: '20px' }}
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default CommentManagementTable;
