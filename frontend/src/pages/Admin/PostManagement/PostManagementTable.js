import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'; // Import Link for navigation

import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';


const PostManagementTable = ({ posts }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ bgcolor: '#53BDEB' }}>
                    <TableRow>
                        <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Bài viết
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
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                {post.type === 'image' ? <CropOriginalIcon sx={{ fontSize: 35 }} /> : <SmartDisplayIcon sx={{ fontSize: 35 }} />}
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                {post.username}
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'Open Sans, sans-serif', textAlign: 'center' }}>
                                {post.email}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                {post.creationDate}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <Link to={`/profile/${post.username}`} style={{ textDecoration: 'none' }}>
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
                                    onClick={() => console.log(`Editing ${post.username}`)}
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
                                    onClick={() => console.log(`Deleting ${post.username}`)}
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
                                        opacity: post.hasReport ? 1 : 0.5,
                                        pointerEvents: post.hasReport ? 'auto' : 'none',
                                        '&:hover': {
                                            bgcolor: post.hasReport ? '#007BB8' : undefined,
                                        },
                                    }}
                                    onClick={() => console.log(`Viewing report for ${post.username}`)}
                                    disabled={!post.hasReport}
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

export default PostManagementTable;
