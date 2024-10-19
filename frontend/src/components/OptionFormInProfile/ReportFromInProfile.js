 import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ReportForm({ handleClose, toggleToOptionForm }) {
    const [selectedReason, setSelectedReason] = React.useState(null);
    const reasons = [
        'Đăng tải nội dung không nên xuất hiện',
        'Tài khoản giả mạo',
        'Người dùng chưa đủ tuổi sử dụng',
    ];

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
 
        console.log('Report submitted for reason:', reason);
        handleClose();  
    };

    return (
        <Box 
            sx={{ 
                width: '400px', 
                bgcolor: 'background.paper', 
                borderRadius: 3, 
                boxShadow: 2, 
                margin: 'auto', 
                p: 2 
            }}
        >
            <Typography variant="h6" gutterBottom align="left">
                Tại sao bạn báo cáo bài viết
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ padding: 0 }}>
                {reasons.map((reason, index) => (
                    <ListItem key={index} sx={{ padding: 0 }}>
                        <ListItemButton
                            onClick={() => handleReasonSelect(reason)}  
                            sx={{ 
                                justifyContent: 'left', 
                                bgcolor: selectedReason === reason ? '#f5f5f5' : 'transparent', 
                                '&:hover': { bgcolor: '#f0f0f0' } 
                            }}
                        >
                            <Typography 
                                variant="body1" 
                                style={{ 
                                    fontWeight: selectedReason === reason ? 'bold' : 'normal', 
                                    color: selectedReason === reason ? '#1976d2' : 'inherit' 
                                }}
                            >
                                {reason}
                            </Typography>
                        </ListItemButton>
                        <Divider />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
                <Button 
                    variant="outlined" 
                    onClick={toggleToOptionForm}  
                    sx={{ flexGrow: 1, marginRight: 1 }}
                >
                    Quay lại
                </Button>
                 
            </Box>
        </Box>
    );
}
