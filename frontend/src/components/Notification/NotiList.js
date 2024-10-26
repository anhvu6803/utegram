import React from 'react';
import './NotiList.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';

const NotiList = ({ notifications }) => {
    return (
        <List className="noti-list">
            {notifications.map((item, index) => (
                <ListItem key={index} disablePadding className="noti-item">
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar src={item.avatar} alt={item.username} className="noti-avatar" />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={
                                <span className="noti-text">
                                    <span className="noti-username">{item.username}</span> 
                                    <span className="noti-action">{item.action}</span>
                                </span>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default NotiList;
