import React, { useState, useEffect } from 'react';
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
    const [reports, setReports] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch reports from the API
    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/report/report-user');
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const data = await response.json();
            setReports(data || []); // Ensure the data is an array
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Call API on component mount
    useEffect(() => {
        fetchReports();
    }, []);

    // Search handler
    const handleSearch = (query) => {
        setQuery(query);
    };

    // Filter reports based on search query
    const filteredReports = reports.filter((report) => {
        const user = report.userId || {}; // Ensure userId exists
        const fullname = user.fullname || '';
        const username = user.username || '';
        const email = user.email || '';


        return (
            fullname.toLowerCase().includes(query.toLowerCase()) ||
            username.toLowerCase().includes(query.toLowerCase()) ||
            email.toLowerCase().includes(query.toLowerCase())
        );
    });

    // Sorting handler
    const handleSortChange = (value) => {
        setSortBy(value);
        setAnchorEl(null);

        const sortedReports = [...reports].sort((a, b) => {
            const userA = a.userId || {};
            const userB = b.userId || {};

            if (value === 'name') {
                return userA.fullname.localeCompare(userB.fullname); // Sorting by name
            } else if (value === 'date') {
                // Sorting by reportedAt date (using _id as a proxy for creation date)
                return new Date(b._id) - new Date(a._id); // Newer reports first
            } else if (value === 'status') {
                // Sorting by reason (status)
                return a.reason.localeCompare(b.reason);
            }
            return 0;
        });

        setReports(sortedReports);
    };

    // Handle popover click
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the popover
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // Handle notification click
    const handleNotificationClick = () => {
        setHasNotifications(false);
        console.log("Notifications clicked");
    };

    // Loading and error handling
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <AdminNavBar page={'users'} />
            <div className="user-container">
                <div className="user-header">Xin chào, Admin</div>
                <div className="user-message">Chúc một ngày tốt lành</div>
                <div className="management-title">Quản lý người dùng</div>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Tìm kiếm người dùng..."
                        onChange={(e) => handleSearch(e.target.value)}
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
                            alignItems: 'center',
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
                            <Typography sx={{ cursor: 'pointer' }} onClick={() => handleSortChange('name')}>
                                Tên
                            </Typography>
                            <Typography sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={() => handleSortChange('date')}>
                                Ngày
                            </Typography>
                            <Typography sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={() => handleSortChange('status')}>
                                Lý do
                            </Typography>
                        </Box>
                    </Popover>

                    <IconButton sx={{ marginLeft: '10px', marginTop: '10px' }} onClick={handleNotificationClick}>
                        <Badge variant="dot" color="error" invisible={!hasNotifications}>
                            <NotificationsIcon sx={{ color: 'black' }} />
                        </Badge>
                    </IconButton>
                </Box>

                <div className="user-table">

                    <UserManagementTable reports={filteredReports} />
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
