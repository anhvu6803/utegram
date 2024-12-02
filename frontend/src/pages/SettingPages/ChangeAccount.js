import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';
import avatar from '../../assets/user.png'

//// Material UI 
import { Box, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';


const ChangePass = () => {
    const { option } = useParams();
    const [bioValue, setBioValue] = useState('');

    const handleBioChangeValue = (event) => {
        const value = event.target.value
        if (value.length <= 150) {
            setBioValue(value);
        }
    }

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
                        <span style={{
                            fontSize: 15, fontWeight: 'normal', 
                            marginTop: '20px', marginLeft: '100px', 
                            color: '#737373', width: '650px'
                        }}>
                            Mật khẩu của bạn phải có tối thiểu 6 ký tự,
                            đồng thời bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!$@%)
                        </span>
                        <Box
                            sx={{
                                width: '650px', height: '70px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '50px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <Box sx={{
                                display: 'flex', flexDirection: 'column',
                                height: '70px', border: 1, width: '650px',
                                borderRadius: '15px', borderColor: '#e5e5e5'
                            }}>
                                <TextField
                                    id="outlined-password-input"
                                    placeholder="Mật khẩu hiện tại"
                                    type="password"
                                    autoComplete="current-password"
                                    slotProps={{
                                        input: {
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', // Hide border of TextField
                                                },
                                                height: '70px',
                                                overflow: 'auto',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: '650px', height: '70px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '30px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <Box sx={{
                                display: 'flex', flexDirection: 'column',
                                height: '70px', border: 1, width: '650px',
                                borderRadius: '15px', borderColor: '#e5e5e5'
                            }}>
                                <TextField
                                    id="outlined-password-input"
                                    placeholder="Mật khẩu mới"
                                    type="password"
                                    autoComplete="current-password"
                                    slotProps={{
                                        input: {
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', // Hide border of TextField
                                                },
                                                height: '70px',
                                                overflow: 'auto',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: '650px', height: '70px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '30px',
                                marginBottom: '20px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <Box sx={{
                                display: 'flex', flexDirection: 'column',
                                height: '70px', border: 1, width: '650px',
                                borderRadius: '15px', borderColor: '#e5e5e5'
                            }}>
                                <TextField
                                    id="outlined-password-input"
                                    placeholder="Nhập lại mật khẩu mới"
                                    type="password"
                                    autoComplete="current-password"
                                    slotProps={{
                                        input: {
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', // Hide border of TextField
                                                },
                                                height: '70px',
                                                overflow: 'auto',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div >
        </Box >
    );
}

export default ChangePass;

