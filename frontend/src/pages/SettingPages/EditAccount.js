import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';
import avatar from '../../assets/user.png'

//// Material UI 
import { Box, ListItemText, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Autocomplete from '@mui/material/Autocomplete';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const EditAccount = () => {
    const { option } = useParams();

    console.log(option);

    return (
        <Box sx={{ background: '#fff' }}>
            <Navbar />
            <NavbarSetting option={option} />
            <div className='home-container'>
                <Box sx={{
                    width: '100%', maxHeight: '100%',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                    },
                    '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                    'scrollbar-width': 'none',
                }}>

                    <Box sx={{
                        width: '900px', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        position: 'absolute', left: '550px'
                    }}>
                        <span style={{ fontSize: 24, fontWeight: 'bold', marginTop: '50px', marginLeft: '100px' }}>
                            Chỉnh sửa trang cá nhân
                        </span>
                        <Box
                            sx={{
                                width: '650px', height: '100px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginLeft: '100px',
                                marginTop: '50px',
                                marginBottom: '20px',
                                backgroundColor: 'rgba(51, 51, 51, 0.2)',
                                borderRadius: '15px'
                            }}

                        >
                            <div style={{
                                display: 'flex',
                                width: '100px', height: '100px',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Avatar src={avatar} sx={{ color: 'black', width: '45px', height: '45px', marginLeft: '20px' }} />
                                <ListItemText
                                    sx={{ width: '150px' }}
                                    style={{ display: 'block' }}
                                    primary='Wasabi1234'
                                    secondary='wasabi123'
                                    primaryTypographyProps={{ style: { fontSize: 14, fontWeight: 'bold' } }}
                                    secondaryTypographyProps={{ style: { fontSize: 13 } }} />
                            </div>
                            <Box
                                sx={{
                                    backgroundColor: '#0095F6', borderRadius: 2, zIndex: 100,
                                    width: '60px', height: '30px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginRight: '20px'
                                }}
                                onClick={() => {

                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                                    Đổi ảnh
                                </span>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: '650px', height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '50px',
                                marginBottom: '20px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <span style={{ fontSize: 20, fontWeight: 'bold', marginBottom: '20px', }}>Tiểu sử</span>
                            <TextField
                                fullWidth
                                variant="outlined"
                                multiline
                                maxRows={2}
                                placeholder="Tiểu sử"
                                slotProps={{
                                    input: {
                                        sx: {
                                            height: '80px',
                                            overflow: 'auto',
                                        },
                                    }
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                width: '650px', height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '50px',
                                marginBottom: '20px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <span style={{ fontSize: 20, fontWeight: 'bold', marginBottom: '20px', }}>Giới tính</span>
                            <Autocomplete
                                disablePortal
                                options={['Nam', 'Nữ', 'Khác']}
                                sx={{ width: '100%', height: '50px' }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <span style={{ fontSize: 13, fontWeight: 'normal', marginTop: '10px', color: '#737373' }}>
                                Thông tin này sẽ không xuất hiện trên trang cá nhân công khai của bạn.
                            </span>
                        </Box>
                    </Box>
                </Box>
            </div>
        </Box>
    );
}

export default EditAccount;

