import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';
import avatar from '../../assets/user.png'
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';
import FinishCreate from '../../components/CreatePostForm/FinishCreate';

//// Material UI 
import { Box, ListItemText, TextField, Modal } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Autocomplete from '@mui/material/Autocomplete';

const EditAccount = () => {
    const { option } = useParams();
    const auth = useContext(AuthContext);

    const cloudName = "dbmynlh3f";

    const uploadPreset = "iezes36w";

    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [fileUrls, setFileUrls] = useState();
    const [bioValue, setBioValue] = useState('');
    const [genderValue, setGenderValue] = useState('');
    const [isFinishCreate, setChangeFinishCreate] = useState(false);
    const [uploadPolicy, setUploadPolicy] = useState();
    const [isLoading, setLoading] = useState(false);
    const [isOpenModal, setOpenModal] = useState(false)
    const [editAvatar, setEditAvatar] = useState(avatar)

    useEffect(() => {
        if (auth.avatar) {
            setEditAvatar(auth.avatar);
        }
        else {
            setEditAvatar(avatar);
        }
    })

    const handleChooseImage = () => {
        fileInputRef.current.click(); // Kích hoạt chọn file
    };
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files)
        const updatedFiles = [...newFiles, ...files.slice(1)];
        setFiles(updatedFiles);
        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setFileUrls(newUrls);
    };

    console.log(files)

    const handleUpload = async (e) => {
        e.preventDefault();

        setChangeFinishCreate(true);
        setOpenModal(true);
        let url;
        let final_decision;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', files[0]);
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
            setLoading(false)
            console.error(err);
        }

        if (final_decision === 'OK') {
            try {

                await fetch(`http://localhost:5000/api/users/${auth.userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        avatar: url,
                        bio: bioValue,
                        gender: genderValue,
                    })
                });

                setLoading(false);
            } catch (error) {
                setLoading(false)
                console.error('Error posting data', error);
            }
        }

    };

    const handleBioChangeValue = (event) => {
        const value = event.target.value
        if (value.length <= 150) {
            setBioValue(value);
        }
    }

    const closeModal = () => {
        if (!isLoading) {
            setOpenModal(false);
        }
    }

    return (

        <div>
            {isFinishCreate &&
                <Modal open={isOpenModal} onClose={closeModal} >
                    <Box
                        sx={{
                            width: '500px', bgcolor: 'background.paper',
                            height: '500px', border: 1, borderRadius: 3, borderColor: 'white',
                            position: 'absolute', bottom: '20%', left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <FinishCreate
                            isLoading={isLoading}
                            uploadPolicy={uploadPolicy}
                        />
                    </Box>
                </Modal>
            }
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
                                    <Avatar src={fileUrls || editAvatar} sx={{ color: 'black', width: '45px', height: '45px', marginLeft: '20px' }} />
                                    <ListItemText
                                        sx={{ width: '150px' }}
                                        style={{ display: 'block' }}
                                        primary={auth.username}
                                        secondary={auth.fullname}
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
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column',
                                    height: '100px', border: 1, width: '650px',
                                    borderRadius: '15px', borderColor: '#e5e5e5'
                                }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={bioValue}
                                        onChange={(event) => {
                                            handleBioChangeValue(event)
                                        }}
                                        multiline
                                        maxRows={2}
                                        placeholder="Tiểu sử"
                                        style={{
                                            textAlign: 'start',
                                        }}
                                        slotProps={{
                                            input: {
                                                maxLength: 150,
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
                                    <span style={{
                                        textAlign: 'right', marginRight: '20px', color: '#c7c7c7', fontSize: 13,
                                        marginBottom: '15px'
                                    }}>
                                        {`${bioValue.length} / 150`}
                                    </span>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    width: '650px', height: '130px',
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
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column',
                                    height: '60px', border: 1, width: '650px',
                                    borderRadius: '15px', borderColor: '#e5e5e5'
                                }}>
                                    <Autocomplete
                                        disablePortal
                                        value={genderValue}
                                        onChange={(event, newValue) => {
                                            setGenderValue(newValue); // Use newValue instead of event.target.value
                                        }}
                                        options={['Nam', 'Nữ', 'Khác']}
                                        sx={{
                                            width: '100%', height: '50px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: 'none', // Hide border of TextField
                                            },
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Box>
                                <span style={{ fontSize: 13, fontWeight: 'normal', marginTop: '10px', color: '#737373' }}>
                                    Thông tin này sẽ không xuất hiện trên trang cá nhân công khai của bạn.
                                </span>
                            </Box>
                            <Box
                                sx={{
                                    backgroundColor: '#0095F6', borderRadius: 2, zIndex: 100,
                                    width: '150px', height: '30px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginLeft: '600px', marginTop: '20px', cursor: 'pointer'
                                }}
                                onClick={(event) => {
                                    handleUpload(event)
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

