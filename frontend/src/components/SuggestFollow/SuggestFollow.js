import React, { useState } from 'react';
import './SuggestFollow.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';

const SuggestFollow = ({ friendSuggestions }) => {
   
    const [followedUsers, setFollowedUsers] = useState([]);

    const handleFollowClick = (username) => {
        if (followedUsers.includes(username)) {
            setFollowedUsers(followedUsers.filter(user => user !== username));
            console.log(`Đã bỏ theo dõi: ${username}`);
        } else {
            setFollowedUsers([...followedUsers, username]);
            console.log(`Đã theo dõi: ${username}`);
        }
    };

    return (
        <List sx={{ width: '100%', height: '100%' }} className="suggest-list">
            {friendSuggestions.map((item, index) => (
                <ListItem key={index} disablePadding className="suggest-item">
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar src={item.avatar} sx={{ width: 40, height: 40 }} />
                        </ListItemAvatar>
                        <div className="suggestion-content">
                            <span className="suggest-username">{item.username}</span>
                            <button
                                className={`follow-button ${followedUsers.includes(item.username) ? 'followed' : ''}`}
                                onClick={() => handleFollowClick(item.username)}
                            >
                                {followedUsers.includes(item.username) ? 'Đã theo dõi' : 'Theo dõi'}
                            </button>
                        </div>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default SuggestFollow;
