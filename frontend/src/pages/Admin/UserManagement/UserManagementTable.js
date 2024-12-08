import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    Grid,
    Typography,
    Box,
    IconButton,
    Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import BlockIcon from '@mui/icons-material/Block';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const UserManagementTable = ({ users }) => {
    const [open, setOpen] = useState(false); 
    const [userInfoModalOpen, setUserInfoModalOpen] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null);
    const [localUsers, setLocalUsers] = useState(users);
    const [userInfo, setUserInfo] = useState(null);
    const [processingReport, setProcessingReport] = useState(false);

    const toggleBanStatus = async (userId, currentStatus) => {
        const endpoint = currentStatus ? `unban` : `ban`;
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                toast.error('You are not logged in or the session has expired. Please log in again.');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/users/${endpoint}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    token: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setLocalUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, banned: !currentStatus } : user
                    )
                );
                toast.success(currentStatus ? 'User unbanned successfully.' : 'User banned successfully.');
            } else {
                toast.error('Failed to update user status.');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('An error occurred while updating the user status.');
        }
    };
    const resolveReport = async (userId) => {
        setProcessingReport(true);
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                toast.error('You are not logged in or the session has expired. Please log in again.');
                setProcessingReport(false);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/report/resolve-report/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setLocalUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, isReport: false, reports: [] } : user
                    )
                );
                toast.success('Report resolved and deleted successfully.');
                handleClose();
            } else {
                toast.error('Failed to resolve the report.');
            }
        } catch (error) {
            console.error('Error resolving report:', error);
            toast.error('An error occurred while resolving the report.');
        } finally {
            setProcessingReport(false);
        }
    };

    const handleViewReport = (user) => {
        if (processingReport) return;
        setSelectedUser(user);
        setOpen(true);
    };

    const handleViewUserInfo = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
                setUserInfoModalOpen(true); 
            } else {
                toast.error('Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            toast.error('An error occurred while fetching user details.');
        }
    };

    const handleClose = () => {
        setOpen(false); 
        setUserInfoModalOpen(false); 
        setSelectedUser(null);
        setUserInfo(null); 
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '800px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: 3,
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ bgcolor: '#53BDEB' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Họ và tên</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Tên người dùng</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Ngày sinh</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {localUsers.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>{user.fullname}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.bornDay}</TableCell>
                            <TableCell>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">
                                    <Grid item>
                                        <button
                                            style={{
                                                backgroundColor: user.isReport ? '#0095F6' : '#B0BEC5',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: user.isReport && !processingReport ? 'pointer' : 'not-allowed',
                                            }}
                                            onClick={() => handleViewReport(user)}
                                            disabled={!user.isReport || processingReport}
                                        >
                                            Xem báo cáo
                                        </button>
                                    </Grid>

                                    <Grid item>
                                        <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
                                            <button
                                                style={{
                                                    backgroundColor: '#0095F6',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Xem trang cá nhân
                                            </button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <button
                                            style={{
                                                backgroundColor: user.banned ? '#03E53B' : '#d32f2f',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => toggleBanStatus(user._id, user.banned)}
                                        >
                                            {user.banned ? (
                                                <AddCircleOutlineIcon sx={{ color: 'white', fontSize: 24 }} />
                                            ) : (
                                                <BlockIcon sx={{ color: 'white', fontSize: 24 }} />
                                            )}
                                        </button>
                                    </Grid>

                                    <Grid item>
                                        <button
                                            style={{
                                                backgroundColor: '#1976D2',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleViewUserInfo(user._id)}
                                        >
                                            <InfoOutlinedIcon sx={{ color: 'white', fontSize: 24 }} />
                                        </button>
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Report Modal */}
        
            {selectedUser && (
                <Modal open={open} onClose={handleClose}>
                    <Box sx={{ 
                        ...modalStyle,
                        maxWidth: '600px',  
                        width: 'auto', 
                    }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                Báo cáo của {selectedUser.fullname}
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <CloseIcon sx={{ color: '#333' }} />
                            </IconButton>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {selectedUser.reports.map((report, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Typography variant="body1">
                                    <strong>Ngày:</strong> {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Lý do:</strong> {report.reason}
                                </Typography>
                            </Box>
                        ))}
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                            <Grid item>
                                <button
                                    onClick={() => resolveReport(selectedUser._id)}
                                    style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '16px 32px',  
                                        fontSize: '16px',  
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: processingReport ? 'not-allowed' : 'pointer',
                                        minWidth: '200px',  
                                        textAlign: 'center', 
                                    }}
                                    disabled={processingReport}
                                >
                                    {processingReport ? 'Đang xử lý...' : 'Đã xử lý'}
                                </button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            )}
            {userInfo && (
            <Modal open={userInfoModalOpen} onClose={handleClose}>
                <Box
                    sx={{
                        ...modalStyle,
                        maxWidth: '600px', 
                        width: '100%', 
                    }}
                >
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '20px',
                                }}
                            >
                                Thông tin người dùng
                            </Typography>
                        </Grid>
                        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                            <CloseIcon sx={{ color: '#333' }} />
                        </IconButton>
                    </Grid>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Typography variant="body1">
                                <strong>Tên người dùng:</strong> {userInfo.username}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Họ và tên:</strong> {userInfo.fullname}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Email:</strong> {userInfo.email}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Ngày sinh:</strong> {new Date(userInfo.bornDay).toLocaleDateString('vi-VN')}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Giới tính:</strong> {userInfo.gender}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Bio:</strong> {userInfo.bio || 'Chưa cập nhật'}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Số bài viết:</strong> {userInfo.posts.length}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Số người theo dõi:</strong> {userInfo.followers.length}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Số người đang theo dõi:</strong> {userInfo.followings.length}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Trạng thái tài khoản:</strong> {userInfo.banned ? 'Bị khóa' : 'Hoạt động'}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Quyền hạn:</strong> {userInfo.isAdmin ? 'Quản trị viên' : 'Người dùng'}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Bài viết vi phạm:</strong> {userInfo.deletedPostsCount}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="body1">
                                <strong>Bình luận vi phạm:</strong> {userInfo.deletedCommentsCount}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        )}
        </TableContainer>
    );
};

export default UserManagementTable;
