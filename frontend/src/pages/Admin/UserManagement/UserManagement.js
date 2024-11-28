import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import AdminNavBar from '../../../components/AdminNavBar/AdminNavBar';
import UserManagementTable from './UserManagementTable';
import { TextField, Box, InputAdornment, IconButton, Popover, Typography, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import _ from 'lodash'; 

const UserManagement = () => {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [hasNotifications, setHasNotifications] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/report/report-user');
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const result = await response.json();
            if (Array.isArray(result.data)) {
                setUsers(result.data);
                setFilteredUsers(result.data); 
            } else {
                throw new Error('Data is not an array');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleSearch = _.debounce((query) => {
        setQuery(query);
        const lowerQuery = query.toLowerCase();
        const filtered = users.filter((user) =>
            user.username?.toLowerCase().includes(lowerQuery)
        );
        setFilteredUsers(filtered);
    }, 300);

    const handleSortChange = (value) => {
        setSortBy(value);
        setAnchorEl(null);

        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (value === 'name') {
                return a.fullname.localeCompare(b.fullname);
            } else if (value === 'date') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (value === 'status') {
                return a.reports.length - b.reports.length;
            }
            return 0;
        });

        setFilteredUsers(sortedUsers);
    };

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
        console.log('Notifications clicked');
    };

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
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                        gap: 2,
                        padding: '0 80px',
                    }}
                >
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
                </Box>

                <div className="user-table">
                    <UserManagementTable users={filteredUsers} />
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
