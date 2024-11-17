import React, { useState, useEffect, useContext } from 'react';
import OptionBar from '../../components/OptionBar/OptionBar';
import PostForm from '../../components/PostForm/PostForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useParams } from 'react-router-dom';

// Material UI
import ImageList from '@mui/material/ImageList';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Modal, Box, Typography } from '@mui/material';
import { ListItemButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const PostWithTag = () => {
    const auth = useContext(AuthContext);
    const { tagName } = useParams(); // Lấy tagName từ URL

    const userId = auth.userId;

    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedPosts, setLoadedPosts] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexPost, setIndexPost] = useState(0);

    const fetchPostsByTag = async () => {
        setIsLoading(true);
        try {
            const responsePosts = await sendRequest(`http://localhost:5000/api/posts/tag/%23${tagName}`);
            setLoadedPosts(responsePosts);
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
        fetchPostsByTag();
    }, [sendRequest, tagName]);

    const [loadedPost, setLoadedPost] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [listComments, setListComment] = useState([]);
    const [listRepliesComment, setListReliesComment] = useState([]);
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

    const openModal = (index) => {
        setIndexPost(index);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    return (
        <Box>
            <OptionBar pages={'explore'} />

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
                ></LoadingButton>
            ) : (
                <Box
                    sx={{
                        width: '1000px',
                        height: '100%',
                        display: 'flex',
                        marginLeft: '400px',
                        flexDirection: 'column',
                    }}
                >
            
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            textAlign: 'left',
                            marginTop: '30px',
                            color: '#000000',
                        }}
                    >
                        #{tagName}
                    </Typography>

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
                            ></LoadingButton>
                        ) : (
                            <Box sx={{ marginTop: '35px' }}>
                                {indexPost > 0 && (
                                    <IconButton
                                        onClick={(event) => {
                                            setIndexPost((prevIndex) => Math.max(prevIndex - 1, 0));
                                            handleLoadPost(event, loadedPosts[indexPost - 1]._id);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '50%',
                                            left: '6.5%',
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
                                        listReplies={listRepliesComment}
                                        closeModal={closeModal}
                                    />
                                )}
                                {indexPost < loadedPosts.length - 1 && (
                                    <IconButton
                                        onClick={(event) => {
                                            setIndexPost((prevIndex) => Math.min(prevIndex + 1, loadedPosts.length - 1));
                                            handleLoadPost(event, loadedPosts[indexPost + 1]._id);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: '50%',
                                            left: '93.5%',
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

                    <ImageList
                        cols={3}
                        sx={{ width: '920px', height: '100%', marginTop: '50px', marginBottom: '10px' }}
                    >
                        {loadedPosts.map((post, index) => (
                            <ListItemButton
                                key={post._id}
                                sx={{
                                    width: '300px',
                                    height: '300px',
                                    padding: '0px',
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                }}
                                onClick={(event) => {
                                    openModal(index);
                                    handleLoadPost(event, post._id);
                                }}
                            >
                                {post.type === 'video' ? (
                                    <video
                                        src={`${post.url[0] + '#t=5'}?w=248&fit=crop&auto=format`}
                                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <img
                                        srcSet={`${post.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${post.url[0]}?w=248&fit=crop&auto=format`}
                                        loading="lazy"
                                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    />
                                )}
                                <ImageListItemBar
                                    key={post.type}
                                    sx={{
                                        background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    }}
                                    position="top"
                                    actionIcon={
                                        post.type === 'video' ? (
                                            <SlideshowIcon
                                                sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }}
                                            />
                                        ) : post.url.length > 1 ? (
                                            <PhotoLibraryIcon
                                                sx={{
                                                    color: 'white',
                                                    marginTop: '10px',
                                                    marginRight: '10px',
                                                }}
                                            />
                                        ) : null
                                    }
                                    actionPosition="right"
                                />
                            </ListItemButton>
                        ))}
                    </ImageList>
                </Box>
            )}
        </Box>
    );
};

export default PostWithTag;
