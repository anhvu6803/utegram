import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './DetailPost.css';
import OptionBar from '../../components/OptionBar/OptionBar';
import PostForm from '../../components/PostForm/PostForm';

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

    const navigate = useNavigate();

    return (
        <Box sx={{ background: '#fff' }}>
            <OptionBar />
            <div className='home-container'>
                <Box sx={{
                    width: '100%', maxHeight: '100%',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                    },
                    '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                    'scrollbar-width': 'none',
                }}>
                    <Box sx={{ marginTop: '50px' }} />
                    <PostForm
                        postId={id}
                    />
                    <Box sx={{ width: '1000px', height: '0.5px', backgroundColor: '#737373', marginTop: '50px', marginLeft: '75px' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '75px', marginTop: '50px' }}>
                        <span style={{ fontSize: 14, color: '#737373' }}>
                            Thêm các bài viết từ
                        </span>

                        <span style={{ fontSize: 14, marginLeft: '5px', fontWeight: 'bold', color: 'black' }}>
                            <Link to={'/profile'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {'wasabi123'}
                            </Link>
                        </span>
                    </div>

                    <ImageList cols={3} sx={{ width: '1000px', height: '100%', marginTop: '10px', background: '#fff', marginLeft: '75px' }}>
                        {itemData.map((item, index) => (
                            <ListItemButton
                                key={item.id}
                                sx={{
                                    width: '330px', height: '330px', padding: '0px', background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                                }}
                                onClick={() => {
                                    navigate(`/post/${item.id}`);
                                }}

                            >
                                <img
                                    srcSet={`${item.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.url[0]}?w=248&fit=crop&auto=format`}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{ width: '330px', height: '330px', objectFit: 'cover' }}
                                />
                                <ImageListItemBar key={item.type}
                                    sx={{
                                        background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    }}
                                    position="top"
                                    actionIcon={
                                        item.type === 'video' ? (
                                            <SlideshowIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                        ) : (item.type === 'image' && item.url.length > 1 ? (
                                            <PhotoLibraryIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                        ) : [])
                                    }
                                    actionPosition="right"
                                />
                            </ListItemButton>
                        ))}
                    </ImageList>


                </Box>
            </div>
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