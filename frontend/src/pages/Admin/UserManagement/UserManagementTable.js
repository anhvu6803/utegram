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
    Button,
    Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import BlockIcon from '@mui/icons-material/Block';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

const UserManagementTable = ({ users }) => {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [localUsers, setLocalUsers] = useState(users);
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

    const handleViewReport = (user) => {
        if (processingReport) return;
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
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

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ bgcolor: '#53BDEB' }}>
                    <TableRow>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Họ và tên
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Tên người dùng
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Email
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Ngày sinh
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Thao tác
                        </TableCell>
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
                                                fontFamily: 'Open Sans, sans-serif',
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
                                                    fontFamily: 'Open Sans, sans-serif',
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
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedUser && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="view-report-modal-title"
                    aria-describedby="view-report-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'auto',
                            maxWidth: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            borderRadius: 1,
                            p: 2,
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            zIndex: 9999,
                        }}
                    >
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" id="view-report-modal-title" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                Báo cáo của {selectedUser.fullname}
                            </Typography>
                            <IconButton onClick={handleClose} color="primary" size="small">
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Divider sx={{ my: 1 }} />
                        {selectedUser.reports.map((report, index) => {
                            const formattedDate = report.createdAt.split('/').reverse().join('-');
                            const reportDate = new Date(formattedDate);

                            return (
                                <Box key={index} sx={{ mb: 3 }}>
                                    <Typography variant="body1">
                                        <strong>Ngày:</strong>{' '}
                                        {reportDate.toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Lý do:</strong> {report.reason}
                                    </Typography>
                                </Box>
                            );
                        })}

                        <Grid container spacing={1} justifyContent="space-between" sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                                <Button
                                    onClick={handleClose}
                                    variant="contained"
                                    color="error"
                                    sx={{ fontWeight: '600', width: '100%', backgroundColor: '#FF4D4D' }}
                                >
                                    Đóng
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    onClick={() => resolveReport(selectedUser._id)}
                                    variant="contained"
                                    color="primary"
                                    sx={{ fontWeight: '600', width: '100%' }}
                                    disabled={processingReport}
                                >
                                    Đã xử lý
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            )}
        </TableContainer>
    );
};

export default UserManagementTable;
