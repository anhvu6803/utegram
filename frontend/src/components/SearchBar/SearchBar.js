import React, { useState } from 'react';
import './SearchBar.css';
import avatar from '../../assets/user.png';

//// Material UI 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';

const items = [
    {
        username: 'wasabi123',
        state: 'Đang theo dõi'
    },
    {
        username: 'wasabi3343',
        state: '21,5 triệu người theo dõi'
    },
    {
        username: 'vusabi3343',
        state: '21,5 triệu người theo dõi'
    },
    {
        username: 'NguyenMEOU',
        state: '21,5 triệu người theo dõi'
    }
];

const SearchForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        console.log(searchValue);
        setSearchTerm(searchValue);

        if (searchValue) {
            const filteredSuggestions = items.filter(({ username }) =>
                username.toLowerCase().includes(searchValue)
            );
            setSuggestions(filteredSuggestions);
            console.log(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <Box sx={{ marginLeft: '20px', marginBottom: '30px', marginTop: '40px' }}>
                    <a className='title' >
                        Tìm kiếm
                    </a>
                    <Box sx={{ marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </Box>
                </Box>

            </div>
            {suggestions <= 0 ? (
                <div className="result-search-box">

                    <div className="recent-box">
                        <a className='recent-text'>
                            Gần đây
                        </a>
                        {items.length > 0 &&
                            <a className='recent-delete'>
                                Xóa tất cả
                            </a>
                        }
                    </div>

                    <div className="recent-list-box">
                        <List sx={{ width: '100%', height: '100%' }}>
                            {items.map((item, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton href={`/profile/${item.username}`}>
                                        <ListItemAvatar>
                                            <Avatar src={avatar} sx={{ width: 35, height: 35 }} />
                                        </ListItemAvatar>
                                        <ListItemText style={{ display: 'block' }} primary={item.username} secondary={item.state} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
            ) : (<div className="result-search-box">
                <List sx={{ width: '100%', height: '100%' }}>
                    {suggestions.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton href={`/profile/${item.username}`}>
                                <ListItemAvatar>
                                    <Avatar src={avatar} sx={{ width: 35, height: 35 }} />
                                </ListItemAvatar>
                                <ListItemText primary={item.username} secondary={item.state} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>)
            }
        </div >
    );
};

export default SearchForm;
