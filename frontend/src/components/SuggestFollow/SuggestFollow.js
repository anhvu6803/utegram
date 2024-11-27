import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../../assets/user.png';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';

const SuggestFollow = ({ loadedUsers, loadedFollows }) => {
    const auth = useContext(AuthContext);

    const userId = auth.userId;

    const [followedItems, setFollowedItems] = useState([]);
    const { timeLoading, sendRequest } = useHttpClient();

    console.log(followedItems)

    useEffect(() => {
        setFollowedItems(loadedFollows);
    })

    const handleFollowedClick = async (event, index) => {
        const updatedFollowedItems = followedItems.map((followed, i) =>
            i === index ? !followed : followed // Toggle the clicked item only
        );
        setFollowedItems(updatedFollowedItems);

        event.preventDefault();

        try {
            await sendRequest(
                `http://localhost:5000/api/profile/follow/${loadedUsers[index]._id}`,
                'PATCH',
                JSON.stringify({
                    userId: userId
                }),
                { 'Content-Type': 'application/json' }
            );

            await sendRequest(
                `http://localhost:5000/api/notify`,
                'POST',
                JSON.stringify({
                    type: "user",
                    content: "đã bắt đầu theo dõi bạn",
                    owner: loadedUsers[index]._id,
                    userId: userId,
                }),
                { 'Content-Type': 'application/json' }
            );
        } catch (err) {

        }
    };

    return (
        <List sx={{ width: '400px', height: '100%', marginTop: '10px' }}>
            {loadedUsers?.map((item, index) => (
                <ListItem>
                    <IconButton
                        sx={{ width: '40px', height: '40px' }}
                        href={`/profile/${item?.username}`}
                    >
                        <Avatar src={item?.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />
                    </IconButton>
                    <ListItemText
                        sx={{ width: '150px' }}
                        style={{ display: 'block' }}
                        primary={
                            <Link to={`/profile/${item?.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {item?.username}
                            </Link>
                        }
                        secondary={`${item?.fullname}`}
                        primaryTypographyProps={{ style: { fontSize: 15 } }}
                        secondaryTypographyProps={{ style: { fontSize: 13 } }} />
                    <ListItemText
                        onClick={(event) => handleFollowedClick(event, index)}
                        primary={followedItems[index] ? 'Đã theo dõi' : 'Theo dõi'}
                        primaryTypographyProps={{ style: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', } }}
                        sx={{
                            marginLeft: 'auto',
                            color: followedItems[index] ? '#000' : '#0095F6', // Initial text color
                            cursor: 'pointer',
                            transition: 'color 0.2s', // Transition for color change
                            '&:hover': {
                                color: followedItems[index] ? '#E9E9E9' : '#007bbd', // Light gray for hover on "Đã theo dõi", darker blue for "Theo dõi"
                            },
                            '&:active': {
                                color: followedItems[index] ? '#D3D3D3' : '#005a9e', // Darker gray for active on "Đã theo dõi", darker blue for active on "Theo dõi"
                            },
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default SuggestFollow;
