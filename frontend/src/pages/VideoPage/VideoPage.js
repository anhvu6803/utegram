import React, { useState, useEffect } from 'react';
import { Box, Typography} from '@mui/material';
import OptionBar from '../../components/OptionBar/OptionBar';
import PostForm from '../../components/PostForm/PostForm';
const VideoPage = () => {
    const [indexPost, setIndexPost] = useState(0);
    
 
    const videoPosts = itemData.filter(item => item.type === 'video');

 
    const handleScroll = (event) => {
        event.preventDefault();  
        const { deltaY } = event;
 
        if (deltaY > 0) {
            setIndexPost(prevIndex => Math.min(prevIndex + 1, videoPosts.length - 1));  
        } else if (deltaY < 0) {
            setIndexPost(prevIndex => Math.max(prevIndex - 1, 0));  
        }
    };

 
    useEffect(() => {
        const container = document.getElementById('video-container');

        const onWheel = (event) => handleScroll(event);
        
 
        if (container) {
            container.addEventListener('wheel', onWheel, { passive: false });
        }
 
        return () => {
            if (container) {
                container.removeEventListener('wheel', onWheel);
            }
        };
    }, []);
 
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowDown') {
                setIndexPost(prevIndex => Math.min(prevIndex + 1, videoPosts.length - 1));  
            } else if (event.key === 'ArrowUp') {
                setIndexPost(prevIndex => Math.max(prevIndex - 1, 0));  
            }
        };

        window.addEventListener('keydown', handleKeyDown);
 
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [videoPosts.length]);

    return (
        <Box sx={{ background: '#fff', overflow: 'hidden', height: '100vh', position: 'relative' }}>
            <OptionBar pages={'videos'} />
            <Box 
                id="video-container" 
                sx={{ height: '100vh', position: 'relative' }}  
            >
                {videoPosts.map((item, index) => (
                    <Box key={item.id} sx={{
                        display: index === indexPost ? 'flex' : 'none',  
                        height: '100vh',  
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 100,
                        backgroundColor: '#FFF', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                    }}>
                        <Box sx={{ position: 'absolute', bottom: 20, left: 20 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                            <Typography variant="body1">{item.author}</Typography>
                        </Box>
                        <PostForm postId={item.id} closeModal={() => {}} />
                    </Box>
                ))}
                
            </Box>
        </Box>
    );
};

export default VideoPage;
const itemData = [
    {
        id: '1',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Burger',
        author: '@rollelflex_graphy726',
        type: 'image',
    },
    {
        id: '2',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1522770179533-24471fcdba45'],
        title: 'Camera',
        author: '@helloimnik',
        type: 'image',
    },
    {
        id: '3',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
        title: 'Coffee',
        author: '@nolanissac',
        type: 'video',
    },
    {
        id: '4',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
        title: 'Hats',
        author: '@hjrc33',
        type: 'video',
    },
    {
        id: '5',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
        title: 'Honey',
        author: '@arwinneil',
        type: 'video',
    },
    {
        id: '6',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'],
        title: 'Basketball',
        author: '@tjdragotta',
        type: 'image',
    },
    {
        id: '7',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
        title: 'Fern',
        author: '@katie_wasserman',
        type: 'video',
    },
    {
        id: '8',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
        title: 'Mushrooms',
        author: '@silverdalex',
        type: 'video',
    },
    {
        id: '9',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1567306301408-9b74779a11af'],
        title: 'Tomato basil',
        author: '@shelleypauls',
        type: 'image',
    },
    {
        id: '10',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1471357674240-e1a485acb3e1'],
        title: 'Sea star',
        author: '@peterlaster',
        type: 'image',
    },
    {
        id: '11',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1589118949245-7d38baf380d6'],
        title: 'Bike',
        author: '@southside_customs',
        type: 'image',
    },
];
