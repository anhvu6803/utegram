import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotiList.css';
import avatar from '../../assets/user.png';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { ListItemButton, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';

const NotiList = ({ notifications }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const userId = auth.userId;

    const { timeLoading, sendRequest } = useHttpClient();
    const [reloadFollowed, setReloadFollowed] = useState(notifications.map((item) => item?.owner?.followings?.includes(item?.userId?._id)));

    const handleReloadFollowed = (index) => {
        const updatedFollowedItems = reloadFollowed.map((item, i) =>
            i === index ? !item : item
        )
        setReloadFollowed(updatedFollowedItems);
    };

    console.log(reloadFollowed)

    const handleFollowedClick = async (event, tagetUserId) => {
        event.preventDefault();

        try {
            await sendRequest(
                `http://localhost:5000/api/profile/follow/${tagetUserId}`,
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
                    owner: tagetUserId,
                    userId: auth.userId,
                }),
                { 'Content-Type': 'application/json' }
            );
        } catch (err) {

        }
    };

    const handleClickNotify = async (event, item) => {
        event.preventDefault();

        if (item?.type === 'user') {
            navigate(`/profile/${item?.userId?.username}`)
        }
        else {
            console.log(item);
            navigate(`/post/${item?.postId?._id}`)
        }
        try {
            await sendRequest(
                `http://localhost:5000/api/notify/${item?._id}`,
                'PATCH',
                JSON.stringify({
                    isViewed: true
                }),
                { 'Content-Type': 'application/json' }
            );
        }
        catch (err) { }
    }

    return (
        <List sx={{ width: '400px', height: '100%', marginTop: '10px' }}>
            {notifications.map((item, index) => (
                <ListItem key={index} >
                    <Box
                        sx={{
                            width: '400px', height: '56px', flexDirection: 'row',
                            alignItems: 'center', display: 'flex', justifyContent: 'space-between',
                            backgroundColor: !item?.isViewed ? '#f7f7f7' : 'paper',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#f7f7f7', // Light gray for hover on "Đã theo dõi", darker blue for "Theo dõi"
                            },
                        }}

                    >
                        <Box
                            sx={{
                                width: '240px', height: '56px', flexDirection: 'row',
                                display: 'flex', alignItems: 'center',
                                marginLeft: '10px'
                            }}

                            onClick={(event) => {
                                handleClickNotify(event, item);
                                window.location.reload();
                            }}
                        >
                            <Avatar src={item?.userId?.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />

                            <span
                                style={{
                                    fontSize: 15,
                                    marginLeft: '10px',
                                    width: '200px',
                                    display: 'block', // Đảm bảo phần tử chiếm toàn bộ chiều rộng
                                    whiteSpace: 'normal', // Cho phép ngắt dòng
                                    wordWrap: 'break-word', // Ngắt khi cần
                                    overflowWrap: 'break-word', // Ngắt từ dài không có khoảng trắng
                                }}
                            >
                                <strong style={{ fontWeight: 'bold' }}>{item?.userId?.username}</strong> {item?.content}
                            </span>
                        </Box>
                        {item?.type === 'post' ?
                            <img
                                srcSet={`${item?.postId?.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item?.postId?.url[0]}?w=248&fit=crop&auto=format`}
                                loading="lazy"
                                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '10px', marginRight: '10px' }}
                            />
                            :
                            <div key={reloadFollowed}>
                                {reloadFollowed[index] ?
                                    <Box
                                        sx={{
                                            backgroundColor: '#efefef', borderRadius: 2, zIndex: 100,
                                            width: '100px', height: '30px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', marginRight: '10px',
                                            '&:hover': {
                                                backgroundColor: '#D7D7D7', // Light gray for hover on "Đã theo dõi", darker blue for "Theo dõi"
                                            },
                                        }}
                                        onClick={(event) => {
                                            handleFollowedClick(event, item?.userId?._id)
                                            handleReloadFollowed(index)
                                        }}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>
                                            Đã theo dõi
                                        </span>
                                    </Box>
                                    :
                                    <Box
                                        sx={{
                                            backgroundColor: '#0095F6', borderRadius: 2, zIndex: 100,
                                            width: '80px', height: '30px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', marginRight: '10px',
                                            '&:hover': {
                                                backgroundColor: '#008AEB', // Light gray for hover on "Đã theo dõi", darker blue for "Theo dõi"
                                            },
                                        }}
                                        onClick={(event) => {
                                            handleFollowedClick(event, item?.userId?._id)
                                            handleReloadFollowed(index)
                                        }}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                                            Theo dõi
                                        </span>
                                    </Box>
                                }

                            </div>
                        }
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};

export default NotiList;
