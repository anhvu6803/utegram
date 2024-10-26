import React from 'react';

// Material UI
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material UI icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function FinishCreate({ isLoading }) {

    return (

        <Box display="flex" alignItems="center" justifyContent="center">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ width: '500px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB' }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>
                        Đã chia sẻ bài viết
                    </span>
                </Box>
                <Box sx={{
                    width: '500px', height: '450px', display: 'flex',
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
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#f09433' }} />
                            <span style={{ fontSize: 22, fontWeight: 'normal', marginTop: '20px' }}>
                                Đã chia sẻ bài viết của bạn
                            </span>
                        </Box>
                    }

                </Box>

            </Box>
        </Box>
    );
}

