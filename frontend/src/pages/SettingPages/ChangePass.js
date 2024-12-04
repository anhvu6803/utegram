import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './SettingPages.css';
import Navbar from '../../components/OptionBar/OptionBar';
import NavbarSetting from '../../components/OptionSetting/OptionSetting';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

//// Material UI 
import { Box, TextField, Modal, IconButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ChangePass = () => {
    const auth = useContext(AuthContext);

    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const { option } = useParams();
    const [presentPassValue, setPresentPassValue] = useState('');
    const [newPassValue, setNewPassValue] = useState('');
    const [confirmNewPassValue, setConfirmNewPassValue] = useState('');
    const [isOpenModal, setOpenModal] = useState(false);
    const [messageErrorPresentPass, setMessageErrorPresentPass] = useState('');
    const [isErrorPresentPass, setIsErrorPresentPass] = useState(false);
    const [messageErrorNewPass, setMessageErrorNewPass] = useState('');
    const [isErrorNewPass, setIsErrorNewPass] = useState(false);
    const [messageErrorConfirmNewPass, setMessageErrorConfirmNewPass] = useState('');
    const [isErrorConfirmNewPass, setIsErrorConfirmNewPass] = useState(false);

    const closeModal = () => {
        setOpenModal(false);
    }

    const validatePassword = (password) => {
        const passwordLengthCheck = password.length >= 8;
        const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return passwordLengthCheck && specialCharCheck;
    };

    const handlePresentPassValue = (event) => {
        const value = event.target.value
        setPresentPassValue(value);
        setIsErrorPresentPass(false);
    }

    const handleNewPassValue = (event) => {
        const value = event.target.value
        setNewPassValue(value);
        setIsErrorNewPass(false);
    }

    const handleConfirmNewPassValue = (event) => {
        const value = event.target.value
        setConfirmNewPassValue(value);
        setIsErrorConfirmNewPass(false);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await sendRequest(
                `http://localhost:5000/api/auth/change-pass/${auth.userId}`,
                'PATCH',
                JSON.stringify({
                    password: presentPassValue,
                    newPassword: confirmNewPassValue,
                }),
                { 'Content-Type': 'application/json' }
            );

            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);
        } catch (err) {
            setMessageErrorPresentPass('Mật khẩu không đúng vui lòng nhập lại!');
            setIsErrorPresentPass(true);
            setPresentPassValue('');
            return;
        }

        if (!validatePassword(newPassValue)) {
            setMessageErrorNewPass('Mật khẩu phải có ít nhất 8 ký tự và 1 ký tự đặc biệt!');
            setIsErrorNewPass(true);
            setNewPassValue('');
            return;
        }

        if (newPassValue !== confirmNewPassValue) {
            setMessageErrorConfirmNewPass('Mật khẩu và xác nhận mật khẩu không khớp!');
            setIsErrorConfirmNewPass(true);
            setConfirmNewPassValue('');
            return;
        }

        setOpenModal(true);

    }

    return (
        <Box sx={{ background: '#fff' }}>
            <Navbar />
            <Modal open={isOpenModal} onClose={closeModal} >
                <Box
                    sx={{
                        width: '500px', backgroundColor: 'white',
                        height: '500px', borderRadius: '15px', borderColor: 'white',
                        position: 'absolute', left: '50%', marginTop: '50px',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <IconButton
                        onClick={() => {
                            closeModal()
                        }}
                        sx={{
                            position: 'absolute', left: '150%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <ClearIcon
                            sx={{ color: 'white', fontSize: 25 }}
                        />
                    </IconButton>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginTop: '120px'
                    }}>
                        {isLoading ?
                            <LoadingButton
                                loading={isLoading}
                                loadingPosition="center"
                                sx={{ height: '100px' }}
                                loadingIndicator={
                                    <CircularProgress
                                        size={100} // Set the size of the loading indicator
                                        sx={{ color: '#f09433' }} // Optional: change color to match your design
                                    />
                                }
                            >
                            </LoadingButton>
                            :
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#f09433' }} />
                                <span style={{ fontSize: 22, fontWeight: 'normal', marginTop: '20px' }}>
                                    Thay đổi mật khẩu thành công
                                </span>
                            </Box>
                        }
                    </Box>
                </Box>
            </Modal>
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
                            Mật khẩu của bạn phải có tối thiểu 8 ký tự,
                            đồng thời có 1 ký tự đặc biệt (!$@%)
                        </span>

                        <TextField
                            id="outlined-password-input"
                            placeholder="Mật khẩu hiện tại"
                            type="password"
                            autoComplete="current-password"
                            value={presentPassValue}
                            onChange={handlePresentPassValue}
                            error={isErrorPresentPass}
                            slotProps={{
                                input: {
                                    sx: {
                                        borderRadius: '15px',
                                        height: '70px', width: '650px',
                                        overflow: 'auto',
                                        marginLeft: '100px', marginTop: '30px'
                                    },
                                }
                            }}
                        />
                        {isErrorPresentPass &&
                            <span style={{
                                marginLeft: '120px', marginTop: '5px',
                                color: '#ED4956', fontSize: 13
                            }}>
                                {messageErrorPresentPass}
                            </span>
                        }

                        <TextField
                            id="outlined-password-input"
                            placeholder="Mật khẩu mới"
                            type="password"
                            autoComplete="current-password"
                            value={newPassValue}
                            onChange={handleNewPassValue}
                            error={isErrorNewPass}
                            slotProps={{
                                input: {
                                    sx: {
                                        borderRadius: '15px',
                                        height: '70px', width: '650px',
                                        overflow: 'auto',
                                        marginLeft: '100px', marginTop: '30px'
                                    },
                                }
                            }}
                        />
                        {isErrorNewPass &&
                            <span style={{
                                marginLeft: '120px', marginTop: '5px',
                                color: '#ED4956', fontSize: 13
                            }}>
                                {messageErrorNewPass}
                            </span>
                        }

                        <TextField
                            id="outlined-password-input"
                            placeholder="Nhập lại mật khẩu mới"
                            type="password"
                            autoComplete="current-password"
                            value={confirmNewPassValue}
                            onChange={handleConfirmNewPassValue}
                            error={isErrorConfirmNewPass}
                            slotProps={{
                                input: {
                                    sx: {
                                        borderRadius: '15px',
                                        height: '70px', width: '650px',
                                        overflow: 'auto',
                                        marginLeft: '100px', marginTop: '30px'
                                    },
                                }
                            }}
                        />
                        {isErrorConfirmNewPass &&
                            <span style={{
                                marginLeft: '120px', marginTop: '5px',
                                color: '#ED4956', fontSize: 13
                            }}>
                                {messageErrorConfirmNewPass}
                            </span>
                        }

                        {presentPassValue?.length > 0 && newPassValue?.length > 0
                            && confirmNewPassValue?.length > 0
                            && !isErrorPresentPass && !isErrorNewPass && !isErrorConfirmNewPass ?
                            <Box
                                sx={{
                                    backgroundColor: '#0095F6', borderRadius: 2, zIndex: 100,
                                    width: '150px', height: '30px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginLeft: '600px', marginTop: '50px', cursor: 'pointer'
                                }}
                                onClick={(event) => {
                                    handleSubmit(event);
                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                                    Gửi
                                </span>
                            </Box>
                            :
                            <Box
                                sx={{
                                    backgroundColor: '#53BDEB', borderRadius: 2, zIndex: 100,
                                    width: '150px', height: '30px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginLeft: '600px', marginTop: '50px',
                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: '#e7e7e7' }}>
                                    Gửi
                                </span>
                            </Box>
                        }
                    </Box>
                </Box>
            </div >
        </Box >
    );
}

export default ChangePass;

