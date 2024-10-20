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
import FormLabel from '@mui/material/FormLabel';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const CommentSetting = () => {
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
                            Bình luận
                        </span>
                        <Box
                            sx={{
                                width: '450px', height: '500px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '100px',
                                marginTop: '30px',
                                backgroundColor: 'transparent',
                                borderRadius: '15px'
                            }}

                        >
                            <span style={{ fontSize: 15, fontWeight: 'bold', marginTop: '30px', marginBottom: '10px'}}>
                                Cho phép bình luận của
                            </span>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="everyone"
                                    name="radio-buttons-group"

                                >
                                    <FormControlLabel label="Mọi người" control={
                                        <Radio
                                            sx={{
                                                color: '#000',
                                                '&.Mui-checked': {
                                                    color: '#000',
                                                },
                                            }}
                                        />}
                                        value="everyone" />
                                    <FormControlLabel label="Những người bạn theo dõi" control={
                                        <Radio
                                            sx={{
                                                color: '#000',
                                                '&.Mui-checked': {
                                                    color: '#000',
                                                },
                                            }}
                                        />}
                                        value="following" />
                                    <FormControlLabel label="Người theo dõi bạn" control={
                                        <Radio
                                            sx={{
                                                color: '#000',
                                                '&.Mui-checked': {
                                                    color: '#000',
                                                },
                                            }}
                                        />}
                                        value="followed" />
                                    <FormControlLabel label="Những người bạn theo dõi và những người theo dõi bạn" control={
                                        <Radio
                                            sx={{
                                                color: '#000',
                                                '&.Mui-checked': {
                                                    color: '#000',
                                                },
                                            }}
                                        />}
                                        value="followed-following" />
                                </RadioGroup>
                            </FormControl>

                        </Box>

                    </Box>

                </Box>
            </div>
        </Box>
    );
}

export default CommentSetting;

