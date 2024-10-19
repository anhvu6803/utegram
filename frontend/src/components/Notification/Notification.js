import React, { useState } from 'react';
import './Notification.css';
import NotiList from '../Notification/NotiList'; 
import CircleHeart from '../../assets/circleheart.jpg';
import SuggestFollow from '../SuggestFollow/SuggestFollow';
import { Avatar } from '@mui/material';
const notifications = [
    // {
    //     username: 'JohnDoe',
    //     avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    //     action: 'liked your post.',
    // },
    // {
    //     username: 'JaneSmith',
    //     avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    //     action: 'commented: "Great post!"',
    // },
    // // Thêm nhiều thông báo để kiểm tra
    // {
    //     username: 'AliceDoe',
    //     avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    //     action: 'shared your post.',
    // },
    // {
    //     username: 'BobSmith',
    //     avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    //     action: 'started following you.',
    // },
];

const friendSuggestions = [
    {
        username: 'Anh Vũ',
        avatar: Avatar,
    },
    {
        username: 'Nhật Nguyên',
        avatar: Avatar,
    },
    {
        username: 'nhatnguyen.hcmute',
        avatar: Avatar,
    }
];

const Notification = () => {
    const [notificationList, setNotificationList] = useState(notifications);

    const handleClearNotifications = () => {
        setNotificationList([]);
    };

    return (
        <div className="notification-container">
            <div className="notification-header">
                <a className="title">Thông báo</a>
            </div>
            <div className="notification-list">
                {notificationList.length > 0 ? (
                    <>
                        <NotiList notifications={notificationList} />
                    </>
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
                <div className="suggest-follow-container">
                    <h4>Gợi ý kết bạn</h4>
                    <SuggestFollow friendSuggestions={friendSuggestions} />
                </div>
            </div>
        </div>
    );
};

export default Notification;
