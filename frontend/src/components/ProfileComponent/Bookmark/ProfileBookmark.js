import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import { Box, IconButton } from '@mui/material';
import { ListItemButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import './ProfileBookmark.css';

const ProfileBookmark = () => {
    const { username } = useParams(); // Lấy username từ URL
    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBookmarks, setLoadedBookmarks] = useState([]);
    const navigate = useNavigate(); // Hook để điều hướng giữa các route

    // Lấy danh sách bài đăng được đánh dấu từ server
    useEffect(() => {
        const fetchBookmarks = async () => {
            setIsLoading(true);
            try {
                const response = await sendRequest(`http://localhost:5000/api/posts/bookmark/${username}`);
                setLoadedBookmarks(response.posts);
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };

        fetchBookmarks();
    }, [sendRequest, username]);

    return (
        <Box>
            {isLoading ? (
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="center"
                    sx={{ height: '500px', marginLeft: '550px', marginTop: '100px' }}
                    loadingIndicator={
                        <CircularProgress size={500} sx={{ color: '#f09433' }} />
                    }
                />
            ) : (
                <Box sx={{ width: '1000px', height: '100%', display: 'flex', marginLeft: '550px', flexDirection: 'column' }}>
                    {loadedBookmarks.length === 0 ? (
                        <div className="no-bookmark">
                            <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                                <BookmarkAddOutlinedIcon 
                                    sx={{ 
                                        fontSize: 150, 
                                        color: '#bdbdbd', 
                                    }} 
                                />
                                <div className="title-no-video">Chưa có nội dung được đánh dấu</div>
                                <div className="desc-no-video">
                                    Khi bạn đánh dấu nội dung, chúng sẽ xuất hiện tại đây để bạn dễ dàng xem lại.
                                </div>
                            </Box>
                        </div>
                    ) : (
                        <ImageList
                            cols={3}
                            sx={{ width: '920px', height: '100%', marginTop: '50px', marginBottom: '10px' }}
                        >
                            {loadedBookmarks.map((bookmark) => (
                                <ListItemButton
                                    key={bookmark._id}
                                    sx={{ width: '300px', height: '300px', padding: '0px', position: 'relative' }}
                                    onClick={() => navigate(`/post/${bookmark._id}`)} // Điều hướng đến URL chi tiết bài đăng
                                >
                                    <ImageListItemBar
                                        actionIcon={
                                            <IconButton sx={{ color: 'white' }}>
                                                <PhotoLibraryIcon />
                                            </IconButton>
                                        }
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: 'rgba(0, 0, 0, 0)',
                                            zIndex: 10,
                                        }}
                                    />
                                    {bookmark.type === 'image' ? (
                                        <img
                                            src={bookmark.url[0]}
                                            alt={bookmark.caption}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <video
                                            src={bookmark.url[0]}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            muted
                                        />
                                    )}
                                </ListItemButton>
                            ))}
                        </ImageList>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ProfileBookmark;
