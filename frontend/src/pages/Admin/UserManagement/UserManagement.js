import React, { useState } from 'react';
import './UserManagement.css';
import AdminNavBar from '../../../components/AdminNavBar/AdminNavBar';
import UserManagementTable from './UserManagementTable'; 
import { TextField, Box, InputAdornment, IconButton, Popover, Typography, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; 
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; 

const UserManagement = () => {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState(''); 
    const [anchorEl, setAnchorEl] = useState(null);
    const [hasNotifications, setHasNotifications] = useState(true);

    // Sample user data
    const users = [
    
        { id: 1, name: 'Nguyễn Văn A', username: 'nguyenvana', email: 'a@example.com', creationDate: '2023-10-01', hasReport: true },
        { id: 2, name: 'Trần Thị B', username: 'tranthib', email: 'b@example.com', creationDate: '2023-10-02', hasReport: false },
        { id: 3, name: 'Lê Văn C', username: 'levanc', email: 'c@example.com', creationDate: '2023-10-03', hasReport: true },
        { id: 4, name: 'Phạm Thị D', username: 'phamthid', email: 'd@example.com', creationDate: '2023-10-04', hasReport: false },
        { id: 5, name: 'Nguyễn Thị E', username: 'nguyenthiE', email: 'e@example.com', creationDate: '2023-10-05', hasReport: true },
        { id: 6, name: 'Trần Nhật Nguyên', username: 'nhatnguye.hcmute', email: 'e@example.com', creationDate: '2023-10-05', hasReport: true },
        { id: 7, name: 'Nguyễn Quốc Anh Vũ', username: 'anhvu.wasabi', email: 'e@example.com', creationDate: '2023-10-05', hasReport: true },
 
    ];

    const handleSearch = (query) => {
        console.log("Searching for:", query);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        console.log("Sorting by:", value);
        setAnchorEl(null);
    };

    React.useEffect(() => {
        handleSearch(query);
    }, [query]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleNotificationClick = () => {
        setHasNotifications(false);
        console.log("Notifications clicked");
    };

    return (
        <div>
            <AdminNavBar />
            <div className="user-container">
                <div className="user-header">Xin chào, Admin</div>
                <div className="user-message">Chúc một ngày tốt lành</div>
                <div className="management-title">Quản lý người dùng</div>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }} >
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Tìm kiếm người dùng..."
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ 
                            flexGrow: 0, 
                            width: '700px', 
                            marginRight: '10px', 
                            marginLeft: '80px',
                            marginTop: '10px',
                            bgcolor: '#fff', 
                            borderRadius: '15px', 
                            border: 'none', 
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '&:hover': { border: 'none' },
                            '&.Mui-focused': { border: 'none' },
                        }} 
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'black' }} /> 
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Typography 
                        variant="body2" 
                        sx={{ 
                            marginLeft: '100px', 
                            marginTop: '10px', 
                            cursor: 'pointer', 
                            bgcolor: '#F5F5F5', 
                            padding: '5px', 
                            borderRadius: '5px',
                            fontWeight: 'bold', 
                            display: 'flex',
                            fontSize: '14px', 
                            alignItems: 'center'
                        }} 
                        onClick={handleClick}
                    >
                        Sắp xếp 
                        <ArrowDropDownIcon sx={{ marginLeft: '5px' }} /> 
                    </Typography>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ padding: '10px' }}>
                            <Typography sx={{ cursor: 'pointer' }} onClick={() => handleSortChange('name')}>Tên</Typography>
                            <Typography sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={() => handleSortChange('date')}>Ngày</Typography>
                            <Typography sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={() => handleSortChange('status')}>Trạng thái</Typography>
                        </Box>
                    </Popover>

                    <IconButton 
                        sx={{ marginLeft: '10px', marginTop: '10px' }} 
                        onClick={handleNotificationClick}
                    >
                        <Badge 
                            variant="dot" 
                            color="error" 
                            invisible={!hasNotifications}
                        >
                            <NotificationsIcon sx={{ color: 'black' }} />
                        </Badge>
                    </IconButton>
                </Box>
                <div className='user-table'>
                  <UserManagementTable users={users} />
                </div>
               
            </div>
        </div>
    );
};

export default UserManagement;
