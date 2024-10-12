import React from 'react';
import './SuggestFollow.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const SuggestFollow = ({ friendSuggestions }) => {
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
                            <Button 
                                variant="contained" 
                                color="primary"
                                size="small"
                                className="add-friend-button"
                            >
                                Follow
                            </Button>
                        </div>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default SuggestFollow;
