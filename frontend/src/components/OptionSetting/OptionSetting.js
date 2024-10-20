import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OptionSetting.css';

// Material UI
import { Box, Button } from '@mui/material';

//// Material UI Icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

const NavbarSetting = ({ option }) => {
    const navigate = useNavigate();

    const [active, setActive] = useState(option);

    const handleIconClick = (option) => {
        setActive(option);
    };

    return (
        <div className={`navbar-setting`}>
            <span
                className={`appname`}
                style={{ color: '#000', fontSize: 24, fontWeight: 'bold' }}
            >
                Cài đặt
            </span>
            <Box
                onClick={ () => {
                    handleIconClick('edit')
                    navigate('/accounts/edit')
                }}
                sx={{
                    cursor: 'pointer',
                    width: '250px', height: '48px',
                    display: 'flex', alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: '30px',
                    marginBottom: '20px',
                    backgroundColor: active === 'edit' ? 'rgba(51, 51, 51, 0.2)' : 'transparent',
                    borderRadius: '12px'
                }}

            >
                <AccountCircleOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px', marginLeft: '20px' }} />
                <span style={{ color: '#000', fontStyle: 'normal' }}>Chỉnh sửa trang cá nhân</span>
            </Box>
            <Box
                onClick={ () => {
                    handleIconClick('blocked_accounts')
                    navigate('/accounts/blocked_accounts')
                }}
                sx={{
                    cursor: 'pointer',
                    width: '250px', height: '48px',
                    display: 'flex', alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: '30px',
                    marginBottom: '20px',
                    backgroundColor: active === 'blocked_accounts' ? 'rgba(51, 51, 51, 0.2)' : 'transparent',
                    borderRadius: '12px'
                }}

            >
                <BlockOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px', marginLeft: '20px' }} />
                <span style={{ color: '#000', fontStyle: 'normal' }}>Đã chặn</span>
            </Box>
            <Box
                onClick={ () => {
                    handleIconClick('comments')
                    navigate('/accounts/comments')
                }}
                sx={{
                    cursor: 'pointer',
                    width: '250px', height: '48px',
                    display: 'flex', alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: '30px',
                    marginBottom: '20px',
                    backgroundColor: active === 'comments' ? 'rgba(51, 51, 51, 0.2)' : 'transparent',
                    borderRadius: '12px'
                }}

            >
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px', marginLeft: '20px' }} />
                <span style={{ color: '#000', fontStyle: 'normal' }}>Bình luận</span>
            </Box>
            <Box
                onClick={ () => {
                    handleIconClick('notifications')
                    navigate('/accounts/notifications')
                }}
                sx={{
                    cursor: 'pointer',
                    width: '250px', height: '48px',
                    display: 'flex', alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: '30px',
                    marginBottom: '20px',
                    backgroundColor: active === 'notifications' ? 'rgba(51, 51, 51, 0.2)' : 'transparent',
                    borderRadius: '12px'
                }}

            >
                <NotificationsOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px', marginLeft: '20px' }} />
                <span style={{ color: '#000', fontStyle: 'normal' }}>Thông báo</span>
            </Box>
            <Box
                onClick={ () => {handleIconClick('change-pass')}}
                sx={{
                    cursor: 'pointer',
                    width: '250px', height: '48px',
                    display: 'flex', alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: '30px',
                    marginBottom: '20px',
                    backgroundColor: active === 'change-pass' ? 'rgba(51, 51, 51, 0.2)' : 'transparent',
                    borderRadius: '12px'
                }}

            >
                <LockResetOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px', marginLeft: '20px' }} />
                <span style={{ color: '#000', fontStyle: 'normal' }}>Thay đổi mật khẩu</span>
            </Box>
        </div>
    );
};

export default NavbarSetting;
