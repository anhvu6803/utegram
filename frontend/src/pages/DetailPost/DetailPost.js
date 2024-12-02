import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import OptionBar from '../../components/OptionBar/OptionBar';
import PostForm from '../../components/PostForm/PostForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

//// Material UI 
import { Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ListItemButton } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const DetailPost = () => {
    const auth = useContext(AuthContext);

    const { id } = useParams();
    const [loadedPost, setLoadedPost] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [loadedPosts, setLoadedPosts] = useState();
    const { timeLoading, sendRequest } = useHttpClient();
    const [listComments, setListComment] = useState([]);
    const [listReliesComment, setListReliesComment] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true)

            try {
                const responsePost = await sendRequest(`http://localhost:5000/api/posts/${id}?age=${auth.age}&&authorId=${auth.userId}`);

                setLoadedPost(responsePost.post);

                const responseUser = await sendRequest(`http://localhost:5000/api/auth/${responsePost.post.author}`);

                setLoadedUser(responseUser.user);

                const responsePosts = await sendRequest(`http://localhost:5000/api/posts/user/${responsePost.post.author}?age=${auth.age}`);

                setLoadedPosts(responsePosts.posts);

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
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);

            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };
        fetchPost();
    }, [sendRequest]);

    console.log(`Time taken to load: ${timeLoading * 1000 + 1000} seconds`);
    console.log(listReliesComment)

    return (
        <Box>
            <OptionBar />

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
                    width: '1200px', height: '1200px', marginLeft: '250px',
                    display: 'flex', flexDirection: 'column',
                }}>
                    <Box sx={{ marginTop: '50px' }} />
                    {(
                        loadedPost && loadedUser && <PostForm
                            post={loadedPost}
                            author={loadedUser}
                            listComments={listComments}
                            listReplies={listReliesComment}
                        />
                    )}
                    {loadedPosts &&
                        <div>
                            <Box sx={{ width: '1000px', height: '0.5px', backgroundColor: '#737373', marginTop: '50px', marginLeft: '125px' }} />
                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '125px', marginTop: '50px' }}>
                                <span style={{ fontSize: 14, color: '#737373' }}>
                                    Thêm các bài viết từ
                                </span>

                                <span style={{ fontSize: 14, marginLeft: '5px', fontWeight: 'bold', color: 'black' }}>
                                    <Link to={`/profile/${loadedUser.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {loadedUser.username}
                                    </Link>
                                </span>
                            </div>

                            <ImageList cols={3}
                                sx={{
                                    width: '1000px', height: '670px', marginTop: '10px',
                                    marginLeft: '125px',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                                    },
                                    '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                                    'scrollbar-width': 'none',
                                }}>
                                {loadedPosts.map((item, index) => (
                                    <ListItemButton
                                        key={item.id}
                                        sx={{
                                            width: '330px', height: '330px', padding: '0px', background:
                                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                        }}
                                        onClick={() => {
                                            navigate(`/post/${item.id}`);
                                            window.location.reload();
                                        }}

                                    >
                                        {item?.url[0]?.includes('video') ?
                                            <video
                                                src={`${item?.url[0] + '#t=5'}?w=248&fit=crop&auto=format`}
                                                style={{ width: '330px', height: '330px', objectFit: 'cover' }}
                                            /> :
                                            <img
                                                srcSet={`${item?.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item?.url[0]}?w=248&fit=crop&auto=format`}
                                                loading="lazy"
                                                style={{ width: '330px', height: '330px', objectFit: 'cover' }}
                                            />

                                        }
                                        <ImageListItemBar key={item.type}
                                            sx={{
                                                background:
                                                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                            }}
                                            position="top"
                                            actionIcon={
                                                item.type === 'video' ? (
                                                    <SlideshowIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px', }} />
                                                ) : (item.type === 'image' && item.url.length > 1 ? (
                                                    <PhotoLibraryIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                                ) : [])
                                            }
                                            actionPosition="right"
                                        />
                                    </ListItemButton>
                                ))}
                            </ImageList>
                        </div>
                    }

                </Box>
            }

        </Box>
    );
}

export default DetailPost;

const itemData = [
    {
        id: 'w1',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Burger',
        author: '@rollelflex_graphy726',
        type: 'image',
    },
    {
        id: 'w2',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Burger',
        author: '@rollelflex_graphy726',
        type: 'image',
    },
    {
        id: 'w3',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Burger',
        author: '@rollelflex_graphy726',
        type: 'image',
    },
    {
        id: 'w4',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Burger',
        author: '@rollelflex_graphy726',
        type: 'image',
    },

];