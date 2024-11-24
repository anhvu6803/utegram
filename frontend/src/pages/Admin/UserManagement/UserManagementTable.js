import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const UserManagementTable = ({ reports }) => {
    const [open, setOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Function to handle banning a user using fetch
    const handleBanUser = async (userId, fullname) => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token'); 
            
            if (!token) {
                alert('You need to be logged in to perform this action');
                return;
            }
            console.log('Banning user:', token, userId, fullname);

            // Perform the PATCH request using fetch to the correct API endpoint
            const response = await fetch(`http://localhost:5000/api/users/ban/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Add the token in the Authorization header
                }
            });

            if (response.ok) {
                alert(`${fullname} has been banned successfully.`);
            } else {
                alert('Failed to ban the user. Please try again.');
            }
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban the user due to a server error.');
        }
    };

    const handleViewReport = (report) => {
        if (report && report.reason) {
            setSelectedReport(report);  
        } else {
            setSelectedReport({ ...report, reason: 'No reason available' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);  
        setSelectedReport(null);  
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
                            Hành Động
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reports.map((report) => {
                        const user = report.userId || {}; 
                        const fullname = user.fullname || ''; 
                        const username = user.username || '';
                        const email = user.email || '';
                        const userId = report.userId?._id; // Extracting userId from the report

                        return (
                            <TableRow key={report._id}> 
                                <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                    {fullname}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                    {username}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                    {email}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <Link to={`/profile/${username}`} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#0095F6',
                                                color: 'white',
                                                borderRadius: '8px',
                                                height: '30px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                fontFamily: 'Open Sans, sans-serif',
                                                '&:hover': {
                                                    bgcolor: '#007BB8',
                                                },
                                            }}
                                        >
                                            Xem Trang Cá Nhân
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="text"
                                        onClick={() => console.log(`Editing ${fullname}`)}
                                        sx={{
                                            marginLeft: '10px',
                                            color: '#565D6D',
                                            fontFamily: 'Open Sans, sans-serif'
                                        }}
                                    >
                                        <BorderColorIcon />
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={() => handleBanUser(userId, fullname)} // Ban user by passing userId from the report
                                        sx={{
                                            marginLeft: '10px',
                                            color: 'red',
                                            fontFamily: 'Open Sans, sans-serif'
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Button>

                                    <Button
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#0095F6',
                                            color: 'white',
                                            borderRadius: '8px',
                                            marginLeft: '10px',
                                            height: '30px',
                                            minWidth: '120px',
                                            maxWidth: '150px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            fontFamily: 'Open Sans, sans-serif',
                                            '&:hover': {
                                                bgcolor: '#007BB8',
                                            },
                                        }}
                                        onClick={() => handleViewReport(report)}
                                    >
                                        Xem Report
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Lý do báo cáo</DialogTitle>
                <DialogContent>
                   <p>{selectedReport ? selectedReport.reason : ''}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

export default UserManagementTable;
