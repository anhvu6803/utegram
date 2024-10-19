import React, { useState } from 'react';
import './OptionBar.css';
import avatar from '../../assets/user.png';
import SearchForm from '../SearchBar/SearchBar';
import Notification from '../Notification/Notification';


import { Box } from '@mui/material';


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

const Navbar = ({ pages }) => {
    const [active, setActive] = useState(pages);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

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

    return (
        <div className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
            <a
                href="/home"
                className='appname'
                onClick={() => {
                    handleIconClick('home');
                    setIsCollapsed(false);
                    setIsSearchVisible(false);
                }}
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
            >
                {active === 'search' ? <SearchIcon sx={{ color: '#000', fontSize: 34 }} /> : <SearchIcon sx={{ color: '#000', fontSize: 30 }} />}
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
            >
                {active === 'videos' ? <MovieIcon sx={{ color: '#000', fontSize: 34 }} /> : <MovieCreationOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Video</span>
            </a>

            <a
                href='/message'
                className={`icon ${active === 'message' ? 'active' : ''}`}
                onClick={() => {
                    handleIconClick('message');
                    setIsCollapsed(true);
                    setIsSearchVisible(false);
                }}
            >
                {active === 'message' ? <ChatBubbleOutlinedIcon sx={{ color: '#000', fontSize: 34 }} /> : <ChatBubbleOutlineOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Nhắn tin</span>
            </a>

            <a
                className={`icon ${active === 'notification' ? 'active' : ''}`}
                onClick={() => {
                    handleIconClick('notification');
                    setIsCollapsed(true);
                    setIsSearchVisible(false);
                }}
            >
                {active === 'notification' ? <FavoriteOutlinedIcon sx={{ color: '#000', fontSize: 34 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Thông báo</span>
            </a>


            {showNotifications && (
                <div className="notification-dropdown">
                    <Notification />
                </div>
            )}

            <a
                className={`icon ${active === 'create' ? 'active' : ''}`}
                onClick={() => handleIconClick('create')}
            >
                {active === 'create' ? <AddBoxIcon sx={{ color: '#000', fontSize: 34 }} /> : <AddBoxOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Tạo</span>
            </a>

            <a
                href="/profile/:username"
                className={`icon ${active === 'profile' ? 'active' : ''}`}
                onClick={() => handleIconClick('profile')}
            >
                <img src={avatar} alt="Profile Avatar" />
                <span>Trang cá nhân</span>
            </a>

            <Box sx={{ marginTop: '50px' }}>
                <a
                    className={`icon ${active === 'menu' ? 'active' : ''}`}
                    onClick={() => handleIconClick('menu')}
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
        </div>
    );
};

export default Navbar;
