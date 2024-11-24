import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import PostForm from '../../PostForm/PostForm';
import './ProfileBookmark.css';

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
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';

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

    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexPost, setIndexPost] = useState(0);

    const openModal = (index) => {
        setIndexPostNext(index);
        setIndexPost(index);
        setIsOpen(true);
    };

    let [indexPostNext, setIndexPostNext] = useState(indexPost);

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
                    sx={{ height: '500px', marginLeft: '550px', marginTop: '100px' }}
                    loadingIndicator={
                        <CircularProgress size={500} sx={{ color: '#f09433' }} />
                    }
                />
            ) : (
                <Box sx={{
                    width: '1000px',
                    height: '100%',
                    display: 'flex',
                    marginLeft: '550px',
                    flexDirection: 'column'
                }}>
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
                        <div>
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
                                                handleDecreseIndex(loadedBookmarks);
                                                handleLoadPost(event, loadedBookmarks[indexPostNext]._id);
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
                                    {loadedBookmarks.length > 1 && indexPostNext < loadedBookmarks.length - 1 && (
                                        <IconButton
                                            onClick={(event) => {
                                                handleIncreseIndex(loadedBookmarks);
                                                handleLoadPost(event, loadedBookmarks[indexPostNext]._id);
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

                        <ImageList
                            cols={3}
                            sx={{ width: '920px', height: '100%', marginTop: '50px', marginBottom: '10px' }}
                        >
                            {loadedBookmarks.map((post, index) => (
                                <ListItemButton
                                    sx={{
                                        width: '300px', height: '300px', padding: '0px', background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                                    }}
                                    onClick={(event) => {
                                        openModal(index)
                                        handleLoadPost(event, post._id)
                                    }}
                                >
                                    {post.type === 'video' ?
                                    <video
                                        src={`${post.url[0] + '#t=5'}?w=248&fit=crop&auto=format`}
                                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    /> :
                                    <img
                                        srcSet={`${post.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${post.url[0]}?w=248&fit=crop&auto=format`}
                                        loading="lazy"
                                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    />

                                }
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                                        }}
                                        position="top"
                                        actionIcon={
                                            post.type === 'video' ? (
                                                <SlideshowIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                            ) : (post.type === 'image' && post.url.length > 1 ? (
                                                <PhotoLibraryIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                            ) : [])
                                        }
                                        actionPosition="right"
                                    />

                                </ListItemButton>
                            ))}
                        </ImageList>
                    </div>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ProfileBookmark;
