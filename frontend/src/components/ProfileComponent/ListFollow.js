import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

// Material UI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';

// Material UI icon
import ClearIcon from '@mui/icons-material/Clear';

const ListFollow = ({ listUser, closeModal, modalType }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [followedStatus, setFollowedStatus] = useState({});

    useEffect(() => {
        const initialFollowedStatus = {};
        listUser.forEach(user => {
            initialFollowedStatus[user._id] = user.isFollowing;
        });
        setFollowedStatus(initialFollowedStatus);
    }, [listUser]);

    const handleFollowClick = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/profile/follow/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: auth.userId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFollowedStatus(prevState => ({
                    ...prevState,
                    [userId]: !prevState[userId],
                }));
            } else {
                console.error('Error toggling follow status:', data.message);
            }
        } catch (error) {
            console.error('Error calling follow/unfollow API:', error);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '400px',
                bgcolor: 'background.paper',
                borderRadius: '15px',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    width: '100%',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <IconButton
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        left: '15px',
                        color: 'black',
                    }}
                >
                    <ClearIcon />
                </IconButton>
                <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {modalType === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}
                </span>
            </Box>

            {/* User List */}
            <List
                sx={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: 0,
                    '&::-webkit-scrollbar': { display: 'none' },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                }}
            >
                {listUser.map((user) => (
                    <ListItem
                        key={user._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 15px',
                            borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                        {/* Avatar */}
                        <IconButton
                            onClick={() => navigate(`/profile/${user.username}`)}
                            sx={{ marginRight: '10px' }}
                        >
                            <Avatar
                                src={user.avatar}
                                alt={user.username}
                                sx={{
                                    width: '45px',
                                    height: '45px',
                                    border: '1px solid #e0e0e0',
                                }}
                            />
                        </IconButton>

                        {/* Username and Fullname */}
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <ListItemText
                                primary={
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        onClick={() => navigate(`/profile/${user.username}`)}
                                    >
                                        {user.username}
                                    </span>
                                }
                                secondary={
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            color: '#757575',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {user.fullname}
                                    </span>
                                }
                            />
                        </Box>

                        {/* Follow Button */}
                        {user._id !== auth.userId && (
                            <Box
                                onClick={() => handleFollowClick(user._id)}
                                sx={{
                                    padding: '5px 15px',
                                    backgroundColor: followedStatus[user._id] ? '#EFEFEF' : '#0095F6',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '30px',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: followedStatus[user._id] ? 'black' : 'white',
                                    }}
                                >
                                    {followedStatus[user._id] ? 'Đã theo dõi' : 'Theo dõi'}
                                </span>
                            </Box>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ListFollow;
