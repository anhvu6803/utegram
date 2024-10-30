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

export default function SeeMore() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <Box sx={{ width: '300px', bgcolor: 'background.paper', marginTop: '100px', border: 1, borderColor: '#777777', borderRadius: 3, zIndex: 2000 }}>
            <ListItemButton
                onClick={() => {
                    navigate('/accounts/edit')
                }}
                sx={{
                    width: '300px', height: '48px', justifyContent: 'center',
                    alignContent: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                }}

            >
                <HexagonOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px' }} />
                <span style={{ color: '#000' }}>Cài đặt</span>
            </ListItemButton>
            <ListItemButton
                onClick={() => { }}
                sx={{ width: '300px', height: '48px', justifyContent: 'center' }}

            >
                <BookmarkBorderOutlinedIcon sx={{ fontSize: 25, color: '#000', marginRight: '10px' }} />
                <span style={{ color: '#000' }}>Đã lưu</span>
            </ListItemButton>
            <Divider />
            <ListItemButton
                onClick={() => {
                    navigate('/')
                    auth.logout()
                }}
                sx={{ width: '300px', height: '48px', justifyContent: 'center' }}

            >
                <span style={{ color: '#000' }}>Đăng xuất</span>
            </ListItemButton>
        </Box>
    );
}
