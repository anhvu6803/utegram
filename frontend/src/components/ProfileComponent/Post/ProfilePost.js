import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import './ProfilePost.css'; // Ensure the CSS file contains appropriate styles
import PostForm from '../../PostForm/PostForm';

// Material UI Components
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListItemButton from '@mui/material/ListItemButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const ProfilePost = () => {
    const { username } = useParams();

    const itemData = [
        {
            id: '1',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
            title: 'Burger',
            author: '@rollelflex_graphy726',
            type: 'image',
        },
        {
            id: '2',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1522770179533-24471fcdba45', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
            title: 'Camera',
            author: '@helloimnik',
            type: 'image',
        },
        {
            id: '3',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c'],
            title: 'Coffee',
            author: '@nolanissac',
            type: 'video',
        },
        {
            id: '4',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1533827432537-70133748f5c8'],
            title: 'Hats',
            author: '@hjrc33',
            type: 'video',
        },
        {
            id: '5',
            username: username,  
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62'],
            title: 'Honey',
            author: '@arwinneil',
            type: 'video',
        },
        {
            id: '6',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'],
            title: 'Basketball',
            author: '@tjdragotta',
            type: 'image',
        },
        {
            id: '7',
            username: username,  
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1518756131217-31eb79b20e8f'],
            title: 'Fern',
            author: '@katie_wasserman',
            type: 'video',
        },
        {
            id: '8',
            username: username,  
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1597645587822-e99fa5d45d25'],
            title: 'Mushrooms',
            author: '@silverdalex',
            type: 'video',
        },
        {
            id: '9',
            username: username,  
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1567306301408-9b74779a11af', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
            title: 'Tomato basil',
            author: '@shelleypauls',
            type: 'image',
        },
        {
            id: '10',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1471357674240-e1a485acb3e1'],
            title: 'Sea star',
            author: '@peterlaster',
            type: 'image',
        },
        {
            id: '11',
            username: username, 
            date: '12/3/2024',
            url: ['https://images.unsplash.com/photo-1589118949245-7d38baf380d6', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
            title: 'Bike',
            author: '@southside_customs',
            type: 'image',
        },
    ];

    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexPost, setIndexPost] = useState(0);

    const openModal = (index) => {
        setIndexPost(index);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    const handleIncreaseIndex = () => {
        if (indexPost < itemData.length - 1) {
            setIndexPost(prevIndex => prevIndex + 1);
        }
    };

    const handleDecreaseIndex = () => {
        if (indexPost > 0) {
            setIndexPost(prevIndex => prevIndex - 1);
        }
    };

    return (
        <Box sx={{ background: '#fff' }}>
            <div className="profile-post">
                {/* Modal for showing post details */}
                <Modal
                    open={modalIsOpen}
                    onClose={closeModal}
                    sx={{ zIndex: 1301 }}
                >
                    <Box sx={{ marginTop: '35px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px' }}>
                        {indexPost > 0 && (
                            <IconButton
                                onClick={handleDecreaseIndex}
                                sx={{ position: 'absolute', left: '10%', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <ArrowCircleLeftIcon sx={{ color: 'white', fontSize: 40 }} />
                            </IconButton>
                        )}
                        <PostForm postId={itemData[indexPost].id} closeModal={closeModal} />
                        {indexPost < itemData.length - 1 && (
                            <IconButton
                                onClick={handleIncreaseIndex}
                                sx={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <ArrowCircleRightIcon sx={{ color: 'white', fontSize: 40 }} />
                            </IconButton>
                        )}
                    </Box>
                </Modal>

                {/* Image List */}
                <ImageList cols={3} sx={{ width: '100%', marginTop: '50px' }}>
                    {itemData.map((item, index) => (
                        <ListItemButton key={item.id} onClick={() => openModal(index)}>
                            <img
                                srcSet={`${item.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.url[0]}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                            <ImageListItemBar
                                sx={{
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                }}
                                position="top"
                                actionIcon={
                                    item.type === 'video' ? (
                                        <SlideshowIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                    ) : (item.type === 'image' && item.url.length > 1 ? (
                                        <PhotoLibraryIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                    ) : null)
                                }
                                actionPosition="right"
                            />
                        </ListItemButton>
                    ))}
                </ImageList>
            </div>
        </Box>
    );
};

export default ProfilePost;
