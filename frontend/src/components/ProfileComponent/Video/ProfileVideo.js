import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  
import PostForm from '../../PostForm/PostForm';
import { useHttpClient } from '../../../shared/hooks/http-hook';

// Material UI
import ImageList from '@mui/material/ImageList';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Modal, Box } from '@mui/material';
import { ListItemButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material icons
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

// Image for no videos
import imgnovideo from '../../../assets/img-no-video.jpg';  // Update this path as per your file structure

import './ProfileVideo.css'; 

const ProfileVideo = () => {
    const { username } = useParams(); // Get username from URL
    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedPosts, setLoadedPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImagePosts = async () => {
            setIsLoading(true);

            try {
                // Use the username from URL to fetch posts
                const responsePosts = await sendRequest(`http://localhost:5000/api/posts/video/${username}`);
                setLoadedPosts(responsePosts.posts);

                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };

        fetchImagePosts();
    }, [sendRequest, username]);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexPost, setIndexPost] = useState(0);

    const openModal = (index) => {
        setIndexPost(index);
        setIsOpen(true);
    };

    const [indexPostNext, setIndexPostNext] = useState(indexPost);

    const handleIncreseIndex = (itemData) => {
        indexPostNext++;
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    };

    const handleDecreseIndex = (itemData) => {
        indexPostNext--;
        if (indexPostNext >= 0) {
            setIndexPostNext(indexPostNext);
        }
    };

    const [loadedPost, setLoadedPost] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [listComments, setListComment] = useState([]);
    const [listReliesComment, setListReliesComment] = useState([]);
    const [isLoadingPost, setLoadingPost] = useState(false);

    const handleLoadPost = async (event, id) => {
        event.preventDefault();
        setLoadingPost(true);
        setLoadedPost();
        setLoadedUser();
        setListComment([]);
        setListReliesComment([]);
        try {
            const responsePost = await sendRequest(`http://localhost:5000/api/posts/${id}`);
            setLoadedPost(responsePost.post);

            const responseUser = await sendRequest(`http://localhost:5000/api/auth/${responsePost.post.author}`);
            setLoadedUser(responseUser.user);

            const responseComments = await sendRequest(`http://localhost:5000/api/posts/comment/${id}`);
            setListComment(responseComments.comments);

            const responsesReplies = await Promise.all(
                responseComments.comments.map(async (item) => {
                    if (item.replies.length > 0) {
                        const responseReplies = await sendRequest(`http://localhost:5000/api/comment/reply/${item._id}`);
                        return responseReplies.replies;
                    } else {
                        return [];
                    }
                })
            );

            setListReliesComment(responsesReplies);

            setTimeout(() => {
                setLoadingPost(false);
            }, timeLoading * 1000 + 1000);
        } catch (err) {
            setTimeout(() => {
                setLoadingPost(false);
            }, timeLoading * 1000 + 1000);
        }
    };

    const closeModal = () => setIsOpen(false);

    return (
        <Box>
            {isLoading ? (
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="center"
                    sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                    loadingIndicator={
                        <CircularProgress
                            size={500} 
                            sx={{ color: '#f09433' }} 
                        />
                    }
                >
                </LoadingButton>
            ) : (
                <Box sx={{
                    width: '1000px',
                    height: '100%',
                    display: 'flex',
                    marginLeft: '550px',
                    flexDirection: 'column'
                }}>
                    {loadedPosts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                            <img src={imgnovideo} alt="No videos" style={{ width: '150px', height: '150px' }} />
                            <div className="title-no-video">Chia sẻ video</div>
                            <div className="desc-no-video">
                                Khi bạn chia sẻ video, video sẽ xuất hiện trên trang cá nhân của bạn.
                            </div>
                        </Box>
                    ) : (
                        <ImageList
                            cols={3}
                            sx={{ width: '920px', height: '100%', marginTop: '50px', marginBottom: '10px' }}
                        >
                            {loadedPosts.map((post, index) => (
                                <ListItemButton
                                    sx={{
                                        width: '300px', height: '300px', padding: '0px', position: 'relative',
                                    }}
                                    key={post._id}
                                    onClick={() => navigate(`/post/${post._id}`)} 
                                >
                                    <ImageListItemBar
                                        actionIcon={
                                            <IconButton sx={{ color: 'white' }}>
                                                <SlideshowIcon />
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
                                    <video
                                        src={post.url[0]}  
                                        alt={post.caption}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </ListItemButton>
                            ))}
                        </ImageList>
                    )}
                    
                    <Modal open={modalIsOpen} onClose={closeModal}>
                        {isLoadingPost ? (
                            <LoadingButton
                                loading={isLoadingPost}
                                loadingPosition="center"
                                sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                                loadingIndicator={
                                    <CircularProgress
                                        size={500} 
                                        sx={{ color: '#f09433' }} 
                                    />
                                }
                            >
                            </LoadingButton>
                        ) : (
                            <Box sx={{ marginTop: '35px' }}>
                                {indexPostNext > 0 && (
                                    <IconButton
                                        onClick={(event) => {
                                            handleDecreseIndex(loadedPosts);
                                            handleLoadPost(event, loadedPosts[indexPostNext]._id);
                                        }}
                                        sx={{
                                            position: 'absolute', bottom: '50%', left: '6.5%',
                                            transform: 'translateX(-50%)',
                                        }}
                                    >
                                        <ArrowCircleLeftIcon
                                            sx={{
                                                color: 'white',
                                                fontSize: 40,
                                                zIndex: 1000,
                                            }}
                                        />
                                    </IconButton>
                                )}
                                {loadedPost && loadedUser && (
                                    <PostForm
                                        post={loadedPost}
                                        author={loadedUser}
                                        listComments={listComments}
                                        listReplies={listReliesComment}
                                        closeModal={closeModal}
                                    />
                                )}
                                {loadedPosts.length > 1 && indexPostNext < loadedPosts.length - 1 && (
                                    <IconButton
                                        onClick={(event) => {
                                            handleIncreseIndex(loadedPosts);
                                            handleLoadPost(event, loadedPosts[indexPostNext]._id);
                                        }}
                                        sx={{
                                            position: 'absolute', bottom: '50%', left: '93.5%',
                                            transform: 'translateX(-50%)',
                                        }}
                                    >
                                        <ArrowCircleRightIcon
                                            sx={{
                                                color: 'white',
                                                fontSize: 40,
                                                zIndex: 1000,
                                            }}
                                        />
                                    </IconButton>
                                )}
                            </Box>
                        )}
                    </Modal>
                </Box>
            )}
        </Box>
    );
};

export default ProfileVideo;
