import React, { useState, useEffect, useContext, useRef } from 'react';
import OptionBar from '../../components/OptionBar/OptionBar';
import PostForm from '../../components/PostForm/PostForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

//// Material UI 
import ImageList from '@mui/material/ImageList';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Modal, Box } from '@mui/material';
import { ListItemButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const ExplorePage = () => {
    const auth = useContext(AuthContext);

    const userId = auth.userId;

    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const [loadPageNumber, setPageNumber] = useState(1);
    const [loadedPosts, setLoadedPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {

        const fetchExplorePage = async () => {
            setIsLoading(true)

            try {
                const responsePosts = await sendRequest(`http://localhost:5000/api/posts/random/${userId}?page=${loadPageNumber}&&limit=9`);

                setLoadedPosts(responsePosts);
                setPageNumber(prevPage => prevPage + 1);

                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);

            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };
        fetchExplorePage();

    }, [sendRequest]);

    const [isHideViewMore, setHideViewMore] = useState(false);

    const handleLoadMore = async (e) => {
        e.preventDefault();

        try {
            setIsFetching(true);

            const responsePosts = await sendRequest(`http://localhost:5000/api/posts/random/${userId}?page=${loadPageNumber}&&limit=9`);

            if (responsePosts.length === 9) {

                setTimeout(() => {
                    setIsFetching(false);
                    setLoadedPosts(prevPosts => [...prevPosts, ...responsePosts]);
                    setPageNumber(prevPage => prevPage + 1);
                }, timeLoading * 1000 + 1000);
            }
            else {
                setTimeout(() => {
                    setIsFetching(false);
                    setLoadedPosts(prevPosts => [...prevPosts, ...responsePosts]);
                    setPageNumber(prevPage => prevPage + 1);
                    setHideViewMore(true)
                }, timeLoading * 1000 + 1000);
            }
        }
        catch (err) {
            setTimeout(() => {
                setIsFetching(false);
            }, timeLoading * 1000 + 1000);
        }
    }

    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexPost, setIndexPost] = useState(0);

    const openModal = (index) => {
        setIndexPostNext(index);
        setIndexPost(index);
        setIsOpen(true);
    };

    let [indexPostNext, setIndexPostNext] = useState(indexPost);

    const handleIncreseIndex = (itemData) => {
        indexPostNext++
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    }
    const handleDecreseIndex = (itemData) => {
        indexPostNext--;
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    }

    const [loadedPost, setLoadedPost] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [listComments, setListComment] = useState([]);
    const [listReliesComment, setListReliesComment] = useState([])
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
                    }
                    else {
                        return [];
                    }
                })
            );

            setListReliesComment(responsesReplies)

            setTimeout(() => {
                setLoadingPost(false);
            }, timeLoading * 1000 + 1000);

        } catch (err) {
            setTimeout(() => {
                setLoadingPost(false);
            }, timeLoading * 1000 + 1000);
        }
    }


    const closeModal = () => setIsOpen(false);

    return (
        <Box>
            <OptionBar pages={'explore'} />

            {isLoading ?
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="center"
                    sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                    loadingIndicator={
                        <CircularProgress
                            size={500} // Set the size of the loading indicator
                            sx={{ color: '#f09433' }} // Optional: change color to match your design
                        />
                    }
                >
                </LoadingButton>
                :

                <Box sx={{
                    width: '1000px',
                    height: '100%',
                    display: 'flex',
                    marginLeft: '400px',
                    flexDirection: 'column'
                }}>
                    <Modal open={modalIsOpen} onClose={closeModal} >
                        {isLoadingPost ?
                            <LoadingButton
                                loading={isLoadingPost}
                                loadingPosition="center"
                                sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                                loadingIndicator={
                                    <CircularProgress
                                        size={500} // Set the size of the loading indicator
                                        sx={{ color: '#f09433' }} // Optional: change color to match your design
                                    />
                                }
                            >
                            </LoadingButton>
                            :
                            <Box sx={{ marginTop: '35px' }}>
                                {indexPostNext > 0 &&
                                    <IconButton
                                        onClick={(event) => {
                                            handleDecreseIndex(loadedPosts);
                                            handleLoadPost(event, loadedPosts[indexPostNext]._id)
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
                                }
                                {(
                                    loadedPost && loadedUser && <PostForm
                                        post={loadedPost}
                                        author={loadedUser}
                                        listComments={listComments}
                                        listReplies={listReliesComment}
                                        closeModal={closeModal}
                                    />
                                )}

                                {loadedPosts.length > 1 && indexPostNext < loadedPosts.length - 1 &&
                                    <IconButton
                                        onClick={(event) => {
                                            handleIncreseIndex(loadedPosts);
                                            handleLoadPost(event, loadedPosts[indexPostNext]._id)
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
                                }
                            </Box>
                        }
                    </Modal>

                    <ImageList
                        cols={3}
                        sx={{ width: '920px', height: '100%', marginTop: '50px', marginBottom: '10px' }}
                    >
                        {loadedPosts.map((post, index) => (
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
                                <ImageListItemBar key={post.type}
                                    sx={{
                                        background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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

                    {isFetching ?
                        <LoadingButton
                            loading={isFetching}
                            sx={{ height: '50px', marginTop: '10px', marginBottom: '50px' }}
                            loadingIndicator={
                                <CircularProgress
                                    size={50} // Set the size of the loading indicator
                                    sx={{ color: '#f09433', marginRight: '70px' }} // Optional: change color to match your design
                                />
                            }
                        >
                        </LoadingButton>
                        :
                        <div>
                            {!isHideViewMore &&
                                < Box
                                    sx={{
                                        backgroundColor: '#0095F6', borderRadius: 2, zIndex: 100,
                                        width: '300px', height: '30px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginLeft: '310px', marginBottom: '10px'
                                    }}
                                    onClick={handleLoadMore}
                                >
                                    <span style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                                        Xem thêm
                                    </span>
                                </Box>
                            }
                        </div>
                    }
                </Box>

            }
        </Box >
    );
}

export default ExplorePage;