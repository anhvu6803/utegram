import React, { useState } from 'react';
import './AdminNavbar.css';

import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArticleIcon from '@mui/icons-material/Article';

const AdminOptionBar = () => {
    const [active, setActive] = useState('users');  

    const handleOptionClick = (option) => {
        setActive(option);
    };

    return (
        <div className="admin-optionbar">
            <h2 className="admin-title">UTEGRAM</h2>
            <div className="options-container">
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
        </div>
    );
};

export default AdminOptionBar;
