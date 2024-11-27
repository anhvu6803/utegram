import React, { useState, useContext, useEffect } from 'react';
import './OptionBar.css';
import avatar from '../../assets/user.png';
import SearchForm from '../SearchBar/SearchBar';
import Notification from '../Notification/Notification';
import UploadContent from '../CreatePostForm/UploadContent';
import SeeMore from '../SeeMore/SeeMore';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

// Material UI
import { Box, Modal } from '@mui/material';
import { jwtDecode } from 'jwt-decode';


import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InstagramIcon from '@mui/icons-material/Instagram';
import Brightness1Icon from '@mui/icons-material/Brightness1';

const Navbar = ({ pages }) => {
    const [active, setActive] = useState(pages);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { timeLoading, sendRequest } = useHttpClient();
    const [notificationList, setNotificationList] = useState([]);
    const [isRemindNotify, setRemindNotify] = useState([]);

    const auth = useContext(AuthContext);

    const userId = auth.userId;

    const handleIconClick = (icon) => {
        setActive(icon);
        if (icon === 'notification') {
            setShowNotifications(true);
            setIsSearchVisible(false);
        } else if (icon === 'search') {
            setIsSearchVisible(true);
            setShowNotifications(false);
        } else {
            setIsSearchVisible(false);
            setShowNotifications(false);
        }
    };

    const [modalUploadPostIsOpen, setIsOpenUploadPost] = useState(false);

    const closeUploadPostModal = () => {
        setIsOpenUploadPost(false);
        window.location.reload();
        setActive('');
    };

    useEffect(() => {
        const fetchNotifies = async () => {

            try {
                const responseNotifies = await sendRequest(`http://localhost:5000/api/notify/${userId}`);

                setNotificationList(responseNotifies.notify);

                setRemindNotify(responseNotifies.notify.map((item) => item.isViewed === false))

            } catch (err) { }
        };
        fetchNotifies();

    }, [sendRequest]);

    console.log(isRemindNotify.includes(true))

    return (
        <div>
            <Modal
                open={modalUploadPostIsOpen}
                onClose={closeUploadPostModal}
                BackdropProps={{
                    onClick: (e) => e.stopPropagation(), // Ngăn click ngoài modal đóng nó
                }}
            >
                <UploadContent closeModal={closeUploadPostModal} />
            </Modal>

            <div className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>

                <a
                    href="/home"
                    className='appname'
                    onClick={() => {
                        handleIconClick('home');
                        setIsCollapsed(false);
                        setIsSearchVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {isCollapsed ? <InstagramIcon sx={{ color: '#000', fontSize: 30, marginBottom: '4px' }} /> : <>UTEGRAM</>}
                </a>

                <a
                    href="/home"
                    className={`icon ${active === 'home' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('home');
                        setIsCollapsed(false);
                        setIsSearchVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {active === 'home' ? <HomeIcon sx={{ color: '#000', fontSize: 34 }} /> : <HomeOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                    <span>Trang chủ</span>
                </a>

                <a
                    className={`icon ${active === 'search' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('search');
                        setIsCollapsed(true);
                        setIsSearchVisible(true);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <SearchIcon sx={{ color: '#000', fontSize: 30 }} />
                    <span>Tìm kiếm</span>
                </a>

                <a
                    href="/explore"
                    className={`icon ${active === 'explore' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('explore');
                        setIsCollapsed(false);
                        setIsSearchVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {active === 'explore' ? <ExploreIcon sx={{ color: '#000', fontSize: 34 }} /> : <ExploreOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                    <span>Khám phá</span>
                </a>

                <a
                    href="/videos"
                    className={`icon ${active === 'videos' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('videos');
                        setIsCollapsed(false);
                        setIsSearchVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {active === 'videos' ? <MovieIcon sx={{ color: '#000', fontSize: 34 }} /> : <MovieCreationOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                    <span>Video</span>
                </a>

                <a
                    href={`/messages`}
                    className={`icon ${active === 'message' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('message');
                        setIsCollapsed(true);
                        setIsSearchVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {active === 'message' ?
                        <ChatBubbleOutlinedIcon sx={{ color: '#000', fontSize: 34 }} />
                        :
                        <ChatBubbleOutlineOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />
                    }
                    <span>Nhắn tin</span>
                </a>

                <a
                    className={`icon ${active === 'notification' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('notification');
                        setIsCollapsed(true);
                        setIsSearchVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {active === 'notification' ?
                        <FavoriteOutlinedIcon sx={{ color: '#000', fontSize: 34 }} />
                        :
                        <Box
                            sx={{
                                flexDirection: 'row',
                                width: '30px', height: '30px'
                            }}
                        >
                            <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />
                            {isRemindNotify.includes(true) &&
                                <Brightness1Icon
                                    sx={{
                                        color: '#ED4956', fontSize: 12,
                                        position: 'absolute', marginLeft: '-10px',
                                        marginBottom: '20px', zIndex: 1000,
                                    }}
                                />
                            }

                        </Box>
                    }
                    <span>Thông báo</span>
                </a>

                {showNotifications && (
                    <div className="notification-dropdown">
                        <Notification notificationList={notificationList} />
                    </div>
                )}

                <a
                    className={`icon ${active === 'create' ? 'active' : ''}`}
                    onClick={() => {
                        handleIconClick('create');
                        setIsOpenUploadPost(true);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {active === 'create' ? <AddBoxIcon sx={{ color: '#000', fontSize: 34 }} /> : <AddBoxOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                    <span>Tạo</span>
                </a>

                <a
                    href={`/profile/${auth.username}`}
                    className={`icon ${active === 'profile' ? 'active' : ''}`}
                    onClick={() => handleIconClick('profile')}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={auth?.avatar || avatar} alt="Profile Avatar" />
                    <span>Trang cá nhân</span>
                </a>

                <Box sx={{ marginTop: '50px' }}>
                    <a
                        className={`icon ${active === 'menu' ? 'active' : ''}`}
                        onClick={() => {
                            setIsMenuVisible(!isMenuVisible);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <MenuOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />
                        <span>Xem thêm</span>
                    </a>
                </Box>

                {isSearchVisible && (
                    <div>
                        <SearchForm />
                    </div>
                )}
                {isMenuVisible && (
                    <Box
                        sx={{
                            position: 'absolute', left: '85%', bottom: '15%',
                            transform: 'translateX(-50%)', zIndex: 2000
                        }}
                    >
                        <SeeMore />
                    </Box>
                )}
            </div>
        </div>
    );
};

export default Navbar;
