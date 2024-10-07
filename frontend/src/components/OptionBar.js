import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OptionBar.css';
import avatar from '../assets/user.png';

// Material UI Icon
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

const Navbar = () => {
    const [active, setActive] = useState('home');

    const handleIconClick = (icon) => {
        setActive(icon);
    };

    return (
        <div className="navbar">
            <a
                href="#home"
                className="appname" 
            >
                UTEGRAM
            </a>
            <a
                href="#home"
                className={`icon ${active === 'home' ? 'active' : ''}`}
                onClick={() => handleIconClick('home')}
            >
                {active === 'home' ? <HomeIcon sx={{ color: '#000', fontSize: 34 }} /> : <HomeOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Trang chủ</span>
            </a>

            <a
                href="#search"
                className={`icon ${active === 'search' ? 'active' : ''}`}
                onClick={() => handleIconClick('search')}
            >
                {active === 'search' ? <SearchIcon sx={{ color: '#000', fontSize: 34 }} /> : <SearchIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Tìm kiếm</span>
            </a>
            <a
                href="#discover"
                className={`icon ${active === 'discover' ? 'active' : ''}`}
                onClick={() => handleIconClick('discover')}
            >
                {active === 'discover' ? <ExploreIcon sx={{ color: '#000', fontSize: 34 }} /> : <ExploreOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Khám phá</span>
            </a>
            <a
                href="#videos"
                className={`icon ${active === 'videos' ? 'active' : ''}`}
                onClick={() => handleIconClick('videos')}
            >
                {active === 'videos' ? <MovieIcon sx={{ color: '#000', fontSize: 34 }} /> : <MovieCreationOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Video</span>
            </a>
            <a
                href="#message"
                className={`icon ${active === 'message' ? 'active' : ''}`}
                onClick={() => handleIconClick('message')}
            >
                {active === 'message' ? <ChatBubbleOutlinedIcon sx={{ color: '#000', fontSize: 34 }} /> : <ChatBubbleOutlineOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Thông báo</span>
            </a>
            <a
                href="#notification"
                className={`icon ${active === 'notification' ? 'active' : ''}`}
                onClick={() => handleIconClick('notification')}
            >
                {active === 'notification' ? <FavoriteOutlinedIcon sx={{ color: '#000', fontSize: 34 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Thông báo</span>
            </a>
            <a
                href="#profile"
                className={`icon ${active === 'profile' ? 'active' : ''}`}
                onClick={() => handleIconClick('profile')}
            >
                <img src={avatar} alt="Profile Avatar" />
                <span>Trang cá nhân</span>
            </a>
            <a
                href="#menu"
                className={`icon ${active === 'menu' ? 'active' : ''}`}
                onClick={() => handleIconClick('menu')}
            >
                <i className="fa fa-menu"></i>
            </a>
            <a></a>
            <a
                href="#menu"
                className={`icon ${active === 'menu' ? 'active' : ''}`}
                onClick={() => handleIconClick('menu')}
            >
                {active === 'menu' ? <MenuOutlinedIcon sx={{ color: '#000', fontSize: 34 }} /> : <MenuOutlinedIcon sx={{ color: '#000', fontSize: 30 }} />}
                <span>Xem thêm</span>
            </a>
        </div>
    );
};

export default Navbar;
