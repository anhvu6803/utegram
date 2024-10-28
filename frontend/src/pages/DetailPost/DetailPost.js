import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import OptionBar from '../../components/OptionBar/OptionBar';
import PostForm from '../../components/PostForm/PostForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';

//// Material UI 
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ListItemButton } from '@mui/material';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const DetailPost = () => {
    const { id } = useParams();
    const [loadedPost, setLoadedPost] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [loadedPosts, setLoadedPosts] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const navigate = useNavigate();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const responsePost = await sendRequest(`http://localhost:5000/api/posts/${id}`);

                setLoadedPost(responsePost.post);

                const responseUser = await sendRequest(`http://localhost:5000/api/auth/${responsePost.post.author}`);

                setLoadedUser(responseUser.user);

                const responsePosts = await sendRequest(`http://localhost:5000/api/posts/user/${responsePost.post.author}`);

                setLoadedPosts(responsePosts.posts);

            } catch (err) { }
        };
        fetchPost();
    }, [sendRequest]);

    return (
        <Box sx={{ background: '#fff' }}>
            <OptionBar />
            <Box sx={{
                width: '1200px', height: '1200px', marginLeft: '250px',
                display: 'flex', flexDirection: 'column',
            }}>
                <Box sx={{ marginTop: '50px' }} />
                {loadedPost && loadedUser && <PostForm
                    postId={id}
                    post={loadedPost}
                    author={loadedUser}
                />}
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

                        <ImageList cols={3} sx={{ width: '1000px', height: '670px', marginTop: '10px', background: '#fff', marginLeft: '125px' }}>
                            {loadedPosts.map((item, index) => (
                                <ListItemButton
                                    key={item.id}
                                    sx={{
                                        width: '330px', height: '330px', padding: '0px', background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                                    }}
                                    onClick={() => {
                                        navigate(`/post/${item.id}`);
                                        window.location.reload();
                                    }}

                                >
                                    {item.type === 'video' ?
                                        <video 
                                            src={`${item.url[0]+'#t=5'}?w=248&fit=crop&auto=format`}
                                            style={{ width: '330px', height: '330px', objectFit: 'cover' }}
                                        /> :
                                        <img
                                            srcSet={`${item.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${item.url[0]}?w=248&fit=crop&auto=format`}
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