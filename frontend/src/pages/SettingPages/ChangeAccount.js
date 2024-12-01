import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';
import avatar from '../../assets/user.png'

//// Material UI 
import { Box, ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';


const ChangePass = () => {
    const { option } = useParams();

    console.log(option);

    return (
        <Box sx={{ background: '#fff' }}>
            <Navbar />
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
                    <NavbarSetting option={option} />
                    <Box sx={{
                        width: '900px', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        position: 'absolute', left: '550px'
                    }}>
                        <span style={{ fontSize: 24, fontWeight: 'bold', marginTop: '50px', marginLeft: '100px' }}>
                            Thay đổi mật khẩu
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 'normal', marginTop: '20px', marginLeft: '100px', color: '#737373' }}>
                            Bạn có thể thay đổi mật khẩu của bạn.
                        </span>
                        <Box
                            sx={{
                                width: '450px', height: '100px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexDirection: 'row',
                                marginLeft: '100px',
                                marginTop: '30px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <div style={{
                                display: 'flex',
                                width: '100px', height: '100px',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Avatar src={avatar} sx={{ color: 'black', width: '45px', height: '45px' }} />
                                <ListItemText
                                    sx={{ width: '100px' }}
                                    style={{ display: 'block' }}
                                    primary='Wasabi1234'
                                    secondary='wasabi123'
                                    primaryTypographyProps={{ style: { fontSize: 14, fontWeight: 'bold' } }}
                                    secondaryTypographyProps={{ style: { fontSize: 13 } }} />
                            </div>
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(51, 51, 51, 0.1)', borderRadius: 2, zIndex: 100,
                                    width: '70px', height: '30px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginRight: '20px',
                                }}
                                onClick={() => {

                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>
                                    Bỏ chặn
                                </span>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div >
        </Box >
    );
}

export default ChangePass;

