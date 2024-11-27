import React, { useState, useEffect, useContext } from 'react';
import './Notification.css';
import NotiList from '../Notification/NotiList';
import CircleHeart from '../../assets/circleheart.jpg';
import SuggestFollow from '../SuggestFollow/SuggestFollow';
import { Avatar } from '@mui/material';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Box, Divider } from '@mui/material';

const Notification = ({ notificationList }) => {
    const { timeLoading, sendRequest } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    const [followedItems, setFollowedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const auth = useContext(AuthContext);

    const userId = auth.userId;

    useEffect(() => {
        const fetchNotifies = async () => {
            setIsLoading(true)

            try {
                const responseUsers = await sendRequest(`http://localhost:5000/api/users/morepost/${userId}`);

                setLoadedUsers(responseUsers.users);

                const responseUser = await sendRequest(`http://localhost:5000/api/auth/${userId}`);

                const followItems = responseUsers.users.map((item) =>
                    responseUser.user.followings.includes(item._id)
                );

                setFollowedItems(followItems);

                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);

            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };
        fetchNotifies();

    }, [sendRequest]);

    console.log(followedItems)

    return (
        <div className="notification-container">
            <div className="notification-header">
                <a className="title">Thông báo</a>
            </div>
            <Box
                sx={{
                    width: '400px',
                    maxheight: '100%',
                    marginTop: '20px',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                    },
                    '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                    'scrollbar-width': 'none',
                }}
            >
                {notificationList.length > 0 ? (

                    <NotiList
                        notifications={notificationList}
                    />

                ) : (
                    <div className="no-notifications">
                        <div className='no-noti'>
                            <img src={CircleHeart} alt="No notifications" className="img-no-notification" />
                            <div className="text-no-notification">
                                <p>Hoạt động trên bài viết của bạn</p>
                                <p>Khi có người thích hoặc bình luận về một trong những bài viết của bạn, bạn sẽ nhìn thấy nó ở đây.</p>
                            </div>
                        </div>
                    </div>
                )}
            </Box>

            <Divider />
            <Box
                sx={{
                    width: '400px',
                    maxheight: '100%',
                    marginTop: '20px', marginLeft: '20px',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                    },
                    '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                    'scrollbar-width': 'none',
                }}
            >
                <span style={{
                    fontSize: 18, fontWeight: 'bold',
                }}>
                    Gợi ý kết bạn
                </span>
                {loadedUsers && followedItems &&
                    < SuggestFollow
                        loadedUsers={loadedUsers}
                        loadedFollows={followedItems}

                    />
                }
            </Box>
        </div >
    );
};

export default Notification;
