import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

// Material UI
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

// Material UI icon
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'; // Icon cho phần quản lý

export default function SeeMore() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: '300px',
                bgcolor: 'background.paper',
                marginTop: '100px',
                border: 1,
                borderColor: '#777777',
                borderRadius: 3,
                zIndex: 2000,
            }}
        >
            {/* Nút Cài đặt */}
            <ListItemButton
                onClick={() => {
                    navigate('/accounts/edit');
                    window.location.reload();
                }}
                sx={{
                    width: '300px',
                    height: '48px',
                    justifyContent: 'center',
                    alignContent: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <HexagonOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px' }} />
                <span style={{ color: '#000' }}>Cài đặt</span>
            </ListItemButton>

            {/* Nút Đã lưu */}
            <ListItemButton
                onClick={() => {
                    navigate(`/profile/${auth?.username}`, { state: { tab: 'saved' } });
                    window.location.reload();
                }}
                sx={{ width: '300px', height: '48px', justifyContent: 'center' }}
            >
                <BookmarkBorderOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px' }} />
                <span style={{ color: '#000' }}>Đã lưu</span>
            </ListItemButton>

            {/* Hiển thị nút "Đi đến phần quản lý" nếu là admin */}
            {auth.isAdmin && (
                <ListItemButton
                    onClick={() => {
                        navigate('/admin/users'); // Điều hướng tới trang quản lý
                    }}
                    sx={{ width: '300px', height: '48px', justifyContent: 'center', marginBottom: '8px' }}
                >
                    <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px' }} />
                    <span style={{ color: '#000' }}>Đi đến phần quản lý</span>
                </ListItemButton>
            )}

            <Divider />

            {/* Nút Đăng xuất */}
            <ListItemButton
                onClick={() => {
                    navigate('/');
                    auth.logout();
                }}
                sx={{ width: '300px', height: '48px', justifyContent: 'center' }}
            >
                <span style={{ color: '#000' }}>Đăng xuất</span>
            </ListItemButton>
        </Box>
    );
}
