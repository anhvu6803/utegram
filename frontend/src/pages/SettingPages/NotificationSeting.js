import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';

//// Material UI 
import { Box } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const NotificationSetting = () => {
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
                        position: 'absolute', left: '550px',
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                        },
                        '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                        'scrollbar-width': 'none',
                    }}>
                        <span style={{ fontSize: 24, fontWeight: 'bold', marginTop: '50px', marginLeft: '100px' }}>
                            Thông báo
                        </span>
                        <Box
                            sx={{
                                width: '450px', height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '30px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Lượt thích
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="everyone"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Từ các trang cá nhân tôi theo dõi" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="following" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Từ mọi người" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="everyone" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Bình luận
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="everyone"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Từ các trang cá nhân tôi theo dõi" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="following" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Từ mọi người" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="everyone" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Lượt thích bình luận
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="on"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Bật" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="on" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Người theo dõi mới
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="on"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Bật" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="on" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Yêu cầu theo dõi được chấp nhận
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="on"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Bật" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="on" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Lời nhắc về tin nhắn
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="on"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Bật" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="on" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                            <Box
                                sx={{
                                    width: '600px', height: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '30px',
                                    backgroundColor: 'transparent',
                                }}

                            >
                                <span style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '20px' }}>
                                    Sinh nhật
                                </span>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="on"
                                        name="radio-buttons-group"

                                    >
                                        <FormControlLabel label="Tắt" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="off" sx={{ marginBottom: '10px' }} />
                                        <FormControlLabel label="Bật" control={
                                            <Radio
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />}
                                            value="on" sx={{ marginBottom: '10px' }} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider />
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </div>
        </Box>
    );
}

export default NotificationSetting;

