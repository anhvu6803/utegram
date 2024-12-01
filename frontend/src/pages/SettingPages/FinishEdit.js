import React from 'react';

// Material UI
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import WarningIcon from '@mui/icons-material/Warning';

// Material UI icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function FinishEdit({ isLoading, uploadPolicy }) {

    return (

        <Box display="flex" alignItems="center" justifyContent="center">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    width: '500px', height: '50px', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB'
                }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>
                        Đã chỉnh sửa trang cá nhân
                    </span>
                </Box>
                <Box sx={{
                    width: '500px', height: '100px', display: 'flex',
                    alignItems: 'center', marginTop: '100px',
                    padding: '0px',
                    flexDirection: 'column'
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
                        <div>
                            {uploadPolicy === 'KO' ?
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}>
                                    <WarningIcon sx={{ fontSize: 100, color: '#E65353' }} />
                                    <span style={{ fontSize: 22, fontWeight: 'normal', marginTop: '20px' }}>
                                        Bạn đã vi phạm quy tắc cộng đồng
                                    </span>
                                </Box>
                                :
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}>
                                    <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#f09433' }} />
                                    <span style={{ fontSize: 22, fontWeight: 'normal', marginTop: '20px' }}>
                                        Đã chỉnh sửa trang cá nhân của bạn
                                    </span>
                                </Box>
                            }
                        </div>
                    }

                </Box>

            </Box>
        </Box>
    );
}

