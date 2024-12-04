import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import avatar from '../../assets/user.png';
import tagImage from '../../assets/tag.png';
import debounce from "lodash.debounce";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

//// Material UI 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';


const SearchForm = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const tagSuggestions = auth.tags;

    const { timeLoading, error, sendRequest, clearError } = useHttpClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchType, setSearchType] = useState('user');

    const handleSearch = async (event) => {
        event.preventDefault();
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (searchValue.startsWith('#')) {
            setSearchType('hashtag')
            const searchTerm = searchValue.split('#').pop(); // Get the tag part after '#'
            const matchedTags = tagSuggestions.filter((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matchedTags.length > 0) {
                const limitedMatchedTags = matchedTags.slice(0, 5);
                setSuggestions(limitedMatchedTags);
            }
            else if (matchedTags.length <= 0) {
                setSuggestions([]);
            }
        }
        else {
            setSearchType('user')
            await handleSearchDebounced(searchValue)
        }
    };

    const handleSearchDebounced = debounce(async (value) => {
        if (value.trim() === "") {
            setSuggestions([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await sendRequest(
                `http://localhost:5000/api/users/search/username?query=${value}&&userId=${auth.userId}`,
                'GET',
            );
            setSuggestions(response);

            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);

        } catch (err) {

            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);
            console.error("Lỗi tìm kiếm:", err);
        }
    }, 300);

    console.log(history)
    const handleClearHistory = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            for (let i = 0; i < history.length; i++) {
                await sendRequest(
                    `http://localhost:5000/api/historySearch/${history[i]._id}`,
                    'DELETE',
                );
            }
            setHistory([])
            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);
        } catch (err) {
            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);
        }
    }

    const handleCreateHistoryUser = async (event, suggestions) => {
        event.preventDefault();
        navigate(`/profile/${suggestions.username}`)
        try {
            setIsLoading(true);
            const response = await sendRequest(
                `http://localhost:5000/api/historySearch`,
                'POST',
                JSON.stringify({
                    type: 'user',
                    owner: auth.userId,
                    userId: suggestions._id
                }),
                { 'Content-Type': 'application/json' }
            );
            setSuggestions(response);

            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);

        } catch (err) {
            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);
        }
    };

    const handleCreateHistoryTag = async (event, tag) => {
        event.preventDefault();
        navigate(`/tag/${tag.replace('#', '')}`);
        try {
            setIsLoading(true);
            const response = await sendRequest(
                `http://localhost:5000/api/historySearch`,
                'POST',
                JSON.stringify({
                    type: 'hashtag',
                    owner: auth.userId,
                    tag: tag
                }),
                { 'Content-Type': 'application/json' }
            );
            setSuggestions(response);

            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);

        } catch (err) {
            setTimeout(() => {
                setIsLoading(false);
            }, timeLoading * 1000 + 1000);
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true)
            try {
                const response = await sendRequest(`http://localhost:5000/api/historySearch/${auth.userId}`);

                setHistory(response.history);
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);

            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };
        fetchHistory();
    }, [sendRequest]);

    return (
        <div className="search-container">
            <div className="search-box">
                <Box sx={{ marginLeft: '20px', marginBottom: '20px', marginTop: '20px' }}>
                    <a className='title' >
                        Tìm kiếm
                    </a>
                    <Box sx={{ marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={searchTerm}
                            onChange={(event) => { handleSearch(event) }}
                            className="search-input"
                        />
                    </Box>
                </Box>

            </div>
            {searchTerm.length <= 0 ? (

                <div className="result-search-box">
                    {isLoading ?
                        <LoadingButton
                            loading={isLoading}
                            loadingPosition="center"
                            sx={{ height: '100px', marginLeft: '150px', marginTop: '50px' }}
                            loadingIndicator={
                                <CircularProgress
                                    size={100} // Set the size of the loading indicator
                                    sx={{ color: '#f09433' }} // Optional: change color to match your design
                                />
                            }
                        >
                        </LoadingButton>
                        :
                        <div>
                            <div className="recent-box">
                                <a className='recent-text'>
                                    Gần đây
                                </a>
                                {history.length > 0 &&
                                    <a className='recent-delete' onClick={(event) => { handleClearHistory(event) }}>
                                        Xóa tất cả
                                    </a>
                                }
                            </div>

                            <div className="recent-list-box">
                                <List sx={{ width: '100%', height: '100%' }}>
                                    {history.map((item, index) => (
                                        <div>
                                            {item.type === 'user' ?
                                                <ListItem key={index} disablePadding>
                                                    <ListItemButton href={`/profile/${item.userId.username}`}>
                                                        <Avatar src={item.userId.avatar || avatar} sx={{ width: '40px', height: '40px' }} />
                                                        <ListItemText style={{ display: 'block' }} primary={item.userId.username} secondary={item.userId.fullname} />
                                                    </ListItemButton>
                                                </ListItem>
                                                :
                                                <ListItem key={index} disablePadding>
                                                    <ListItemButton href={`/tag/${item.tag.replace('#', '')}`}>
                                                        <Avatar src={tagImage} sx={{ width: '40px', height: '40px', border: 1, borderColor: '#dbdbdb' }} />
                                                        <ListItemText style={{ display: 'block' }} primary={item.tag} />
                                                    </ListItemButton>
                                                </ListItem>
                                            }
                                        </div>
                                    ))}
                                </List>
                            </div>
                        </div>
                    }
                </div>
            ) : (<div className="result-search-box">
                {isLoading ?
                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="center"
                        sx={{ height: '100px', marginLeft: '150px', marginTop: '50px' }}
                        loadingIndicator={
                            <CircularProgress
                                size={100} // Set the size of the loading indicator
                                sx={{ color: '#f09433' }} // Optional: change color to match your design
                            />
                        }
                    >
                    </LoadingButton>
                    :
                    <div>
                        {suggestions.length === 0 ?
                            <span style={{ fontSize: 18, display: 'flex', justifyContent: 'center' }}>
                                Không tìm thấy kết quả
                            </span>
                            :
                            <div>
                                {searchType === 'hashtag' ?
                                    <List sx={{ width: '100%', height: '100%' }}>
                                        {Array.from({ length: suggestions.length }, (_, i) => (
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={(event) => {
                                                        handleCreateHistoryTag(event, suggestions[i])
                                                    }}
                                                >
                                                    <Avatar src={tagImage} sx={{ width: '40px', height: '40px', border: 1, borderColor: '#dbdbdb' }} />
                                                    <ListItemText primary={suggestions[i]} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                    :

                                    <List sx={{ width: '100%', height: '100%' }}>
                                        {Array.from({ length: suggestions.length }, (_, i) => (
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={(event) => {
                                                        handleCreateHistoryUser(event, suggestions[i])
                                                    }}
                                                >
                                                    <Avatar src={suggestions[i].avatar || avatar} sx={{ width: '40px', height: '40px' }} />
                                                    <ListItemText primary={suggestions[i].username} secondary={suggestions[i].fullname} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                }
                            </div>
                        }
                    </div>
                }
            </div>)
            }
        </div >
    );
};

export default SearchForm;
