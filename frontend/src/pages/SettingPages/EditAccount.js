import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';
import avatar from '../../assets/user.png'
import axios from 'axios';

//// Material UI 
import { Box, ListItemText, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Autocomplete from '@mui/material/Autocomplete';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const EditAccount = () => {
    const { option } = useParams();

    const cloudName = "dbmynlh3f";

    const uploadPreset = "iezes36w";

    const fileInputRef = useRef(null);
    const [file, setFile] = useState();
    const [uploadPolicy, setUploadPolicy] = useState();
    const [isLoading, setLoading] = useState(false);


    const handleChooseImage = () => {
        fileInputRef.current.click(); // Kích hoạt chọn file
    };
    const handleFileChange = (event) => {
        const newFile = event.target.files;
        setFile(newFile);
    };

    const handleUpload = async () => {
        let url;
        let final_decision;
        setLoading(true);


        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset); // Thay bằng upload preset của bạn
        formData.append('cloud_name', cloudName); // Thay bằng cloud_name của bạn

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                formData
            );
            url = res.data.secure_url
            const publicId = res.data.public_id;
            let response;

            response = await fetch('http://localhost:5000/api/posts/check/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: url,
                    publicId: publicId
                })
            });


            const responseData = await response?.json();
            final_decision = responseData.final_decision;

            if (responseData.final_decision === 'KO') {
                setUploadPolicy(responseData.final_decision);
                setLoading(false)
                return null;
            }

        } catch (err) {
            console.error(err);
        }

        if (final_decision === 'OK') {
            try {

                const response = await fetch('http://localhost:5000/api/posts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({

                    })
                });

                const responseData = await response.json();
                console.log(responseData);
                setLoading(false);
            } catch (error) {
                console.error('Error posting data', error);
            }
        }

    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
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
                                    backgroundColor: '#efefef',
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
                                        width: '80px', height: '30px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginRight: '20px', cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        handleChooseImage()
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
                            <Box
                                sx={{
                                    backgroundColor: '#0095F6', borderRadius: 2, zIndex: 100,
                                    width: '150px', height: '30px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginLeft: '600px', marginTop: '20px'
                                }}
                                onClick={() => {

                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                                    Gửi
                                </span>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </Box>
        </div>
    );
}

export default EditAccount;

