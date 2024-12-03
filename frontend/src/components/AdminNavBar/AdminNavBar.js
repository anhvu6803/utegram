import React, { useState } from 'react';
import './AdminNavbar.css';

import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';

const AdminOptionBar = ({ page }) => {
    const [active, setActive] = useState(page);

    const handleOptionClick = (option) => {
        setActive(option);
    };

    return (
        <div className="admin-optionbar">
            <h2 className="admin-title">UTEGRAM</h2>
            <div className="options-container">
                {/* Home option */}
                

                {/* Users option */}
                <div className="option-group">
                    <a
                        href="/admin/users"
                        className={`option ${active === 'users' ? 'active' : ''}`}
                        onClick={() => handleOptionClick('users')}
                    >
                        {active === 'users' ? (
                            <ManageAccountsIcon sx={{ color: '#000', fontSize: 24 }} />
                        ) : (
                            <ManageAccountsOutlinedIcon sx={{ color: '#000', fontSize: 24 }} />
                        )}
                        <span className="option-text">Người dùng</span>
                    </a>
                </div>

                {/* Posts option */}
                <div className="option-group">
                    <a
                        href="/admin/posts"
                        className={`option ${active === 'posts' ? 'active' : ''}`}
                        onClick={() => handleOptionClick('posts')}
                    >
                        {active === 'posts' ? (
                            <ArticleIcon sx={{ color: '#000', fontSize: 24 }} />
                        ) : (
                            <ArticleOutlinedIcon sx={{ color: '#000', fontSize: 24 }} />
                        )}
                        <span className="option-text">Bài viết</span>
                    </a>
                </div>

     
                <div className="option-group">
                    <a
                        href="/admin/comments"
                        className={`option ${active === 'comments' ? 'active' : ''}`}
                        onClick={() => handleOptionClick('comments')}
                    >
                        <CommentIcon sx={{ color: '#000', fontSize: 24 }} />
                        <span className="option-text">Quản lý comments</span>
                    </a>
                </div>
                <div className="option-group">
                    <a
                        href="/home"
                        className={`option ${active === 'home' ? 'active' : ''}`}
                        onClick={() => handleOptionClick('home')}
                    >
                        {active === 'home' ? (
                            <HomeIcon sx={{ color: '#000', fontSize: 24 }} />
                        ) : (
                            <HomeOutlinedIcon sx={{ color: '#000', fontSize: 24 }} />
                        )}
                        <span className="option-text">Đi đến trang chủ</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminOptionBar;
