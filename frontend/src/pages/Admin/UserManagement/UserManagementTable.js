import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'; // Import Link for navigation

const UserManagementTable = ({ users }) => {
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
                            Ngày Tạo
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Hành Động
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                {user.name}
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                {user.username}
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                {user.email}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                {user.creationDate}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none' }}>
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
                                    onClick={() => console.log(`Editing ${user.name}`)}
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
                                    onClick={() => console.log(`Deleting ${user.name}`)}
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
                                        opacity: user.hasReport ? 1 : 0.5,
                                        pointerEvents: user.hasReport ? 'auto' : 'none',
                                        '&:hover': {
                                            bgcolor: user.hasReport ? '#007BB8' : undefined,
                                        },
                                    }}
                                    onClick={() => console.log(`Viewing report for ${user.name}`)}
                                    disabled={!user.hasReport}
                                >
                                    Xem Report
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserManagementTable;
