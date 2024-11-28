import React, { useState } from 'react';
import './AdminNavbar.css';

import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ImageIcon from '@mui/icons-material/Image';
import CommentIcon from '@mui/icons-material/Comment';

const AdminOptionBar = ({ page }) => {
    const [active, setActive] = useState(page);

    const handleOptionClick = (option) => {
        setActive(option);
    };

    return (
        <div className="admin-optionbar">
            <h2 className="admin-title">UTEGRAM</h2>
            <div className="options-container">
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

              
                <div className="option-group">
                    <a
                     
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
                    {active === 'posts' && (
                        <div className="sub-options">
                            <a
                                href="/admin/posts"
                                className={`sub-option ${active === 'manage-posts' ? 'active' : ''}`}
                                onClick={() => handleOptionClick('manage-posts')}
                            >
                                <ImageIcon sx={{ fontSize: 18, marginRight: '5px' }} />
                                Quản lý bài viết
                            </a>
                           
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOptionBar;
