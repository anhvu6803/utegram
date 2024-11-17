import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import { Modal, Box, IconButton } from '@mui/material';
import { ListItemButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import imgnobookmark from '../../../assets/nobookmark.jpg'; // Placeholder for no bookmarks

import './ProfileBookmark.css';

const ProfileBookmark = () => {
    const { username } = useParams(); // Get username from URL
    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBookmarks, setLoadedBookmarks] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexBookmark, setIndexBookmark] = useState(0);

    const navigate = useNavigate();

    // Fetch bookmarks (images and videos)
    useEffect(() => {
        const fetchBookmarks = async () => {
            setIsLoading(true);
            try {
                // Use the username from URL to fetch bookmarks (both images and videos)
                const response = await sendRequest(`http://localhost:5000/api/posts/bookmark/${username}`);
                setLoadedBookmarks(response.posts); // Response is structured as posts
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

    // Open modal for a specific bookmark
    const openModal = (index) => {
        setIndexBookmark(index);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    // Handle next and previous buttons for modal
    const handleIncreseIndex = () => {
        setIndexBookmark((prev) => Math.min(prev + 1, loadedBookmarks.length - 1));
    };

    const handleDecreseIndex = () => {
        setIndexBookmark((prev) => Math.max(prev - 1, 0));
    };

    return (
        <Box>
            {isLoading ? (
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="center"
                    sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                    loadingIndicator={
                        <CircularProgress size={500} sx={{ color: '#f09433' }} />
                    }
                />
            ) : (
                <Box sx={{ width: '1000px', height: '100%', display: 'flex', marginLeft: '550px', flexDirection: 'column' }}>
                    {loadedBookmarks.length === 0 ? (
                        <div className='no-bookmark'>
                            <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                                <img src={imgnobookmark} alt="No bookmarks" style={{ width: '150px', height: '150px' }} />
                                <div className="title-no-video">Chưa có nội dung được đánh dấu</div>
                                <div className="desc-no-video">
                                    Khi bạn đánh dấu nội dung, chúng sẽ xuất hiện tại đây để bạn dễ dàng xem lại.
                                </div>
                            </Box>
                        </div>
                    ) : (
                        <>
                            <Modal open={modalIsOpen} onClose={closeModal}>
                                <Box sx={{ marginTop: '35px' }}>
                                    {indexBookmark > 0 && (
                                        <IconButton
                                            onClick={handleDecreseIndex}
                                            sx={{
                                                position: 'absolute',
                                                bottom: '50%',
                                                left: '6.5%',
                                                transform: 'translateX(-50%)',
                                            }}
                                        >
                                            <ArrowCircleLeftIcon sx={{ color: 'white', fontSize: 40 }} />
                                        </IconButton>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                        {/* Render the bookmark based on its type (video or image) */}
                                        {loadedBookmarks[indexBookmark].type === 'image' ? (
                                            <img
                                                src={loadedBookmarks[indexBookmark].url[0]}
                                                alt={loadedBookmarks[indexBookmark].caption}
                                                style={{ maxHeight: '80vh', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <video controls style={{ maxHeight: '80vh', objectFit: 'contain' }}>
                                                <source src={loadedBookmarks[indexBookmark].url[0]} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </Box>

                                    {indexBookmark < loadedBookmarks.length - 1 && (
                                        <IconButton
                                            onClick={handleIncreseIndex}
                                            sx={{
                                                position: 'absolute',
                                                bottom: '50%',
                                                left: '93.5%',
                                                transform: 'translateX(-50%)',
                                            }}
                                        >
                                            <ArrowCircleRightIcon sx={{ color: 'white', fontSize: 40 }} />
                                        </IconButton>
                                    )}
                                </Box>
                            </Modal>

                            <ImageList
                                cols={3}
                                sx={{ width: '920px', height: '100%', marginTop: '50px', marginBottom: '10px' }}
                            >
                                {loadedBookmarks.map((bookmark, index) => (
                                    <ListItemButton
                                        key={bookmark._id}
                                        sx={{ width: '300px', height: '300px', padding: '0px', position: 'relative' }}
                                        onClick={() => openModal(index)}
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
                                        {/* Render the bookmark based on its type (video or image) */}
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
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ProfileBookmark;
