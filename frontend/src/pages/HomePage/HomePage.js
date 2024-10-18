import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import OptionBar from '../../components/OptionBar/OptionBar';
import avatar from '../../assets/user.png';
import PostForm from '../../components/PostForm/PostForm';

//// Material UI 
import List from '@mui/material/List';
import ImageList from '@mui/material/ImageList';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Modal, Box } from '@mui/material';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { ListItemButton } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const HomePage = () => {
    const [followedItems, setFollowedItems] = useState(itemData.map(() => false));

    const handleFollowedClick = (index) => {
        const updatedFollowedItems = followedItems.map((followed, i) =>
            i === index ? !followed : followed // Toggle the clicked item only
        );
        setFollowedItems(updatedFollowedItems);
    };

    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexPost, setIndexPost] = useState(0);

    const openModal = (index) => {
        setIndexPostNext(index);
        setIndexPost(index);
        setIsOpen(true);
    };

    let [indexPostNext, setIndexPostNext] = useState(indexPost);

    const handleIncreseIndex = () => {
        indexPostNext++
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    }
    const handleDecreseIndex = () => {
        indexPostNext--;
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    }

    const closeModal = () => setIsOpen(false);

    return (
        <Box sx={{ background: '#fff' }}>
            <OptionBar pages={'home'} />
            <div className='appname'>
                Bài viết gợi ý
            </div>
            <div className='home-container'>

                <Modal open={modalIsOpen} onClose={closeModal} >
                    <Box sx={{ marginTop: '35px' }}>
                        {indexPostNext > 0 &&
                            <IconButton
                                onClick={() => {
                                    handleDecreseIndex();
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
                        <PostForm
                            postId={itemData[indexPostNext].id}
                            closeModal={closeModal}
                        />
                        {itemData.length > 1 && indexPostNext < itemData.length - 1 &&
                            <IconButton
                                onClick={() => {
                                    handleIncreseIndex();
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
                </Modal>

                <ImageList cols={2} sx={{ width: '620px', height: '100%', marginTop: '50px' }}>
                    {itemData.map((item, index) => (
                        <ListItemButton
                            key={item.id}
                            sx={{
                                width: '300px', height: '300px', padding: '0px', background:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                            }}
                            onClick={() => {
                                openModal(index)
                            }}

                        >
                            <img
                                srcSet={`${item.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.url[0]}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                style={{ width: '300px', height: '300px', objectFit: 'cover' }}
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
                <List sx={{ width: '300px', height: '100%', marginLeft: '100px', marginTop: '30px' }}>
                    <ListItemText
                        primary='Gợi ý cho bạn'
                        primaryTypographyProps={{ style: { fontSize: 13, fontWeight: 'bold' } }} />
                    {itemData.map((item, index) => (
                        <ListItem>
                            <IconButton
                                sx={{ width: '40px', height: '40px' }}
                                href='/profile'
                            >
                                <Avatar src={avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />
                            </IconButton>
                            <ListItemText
                                sx={{ width: '150px' }}
                                style={{ display: 'block' }}
                                primary={
                                    <Link to='/profile/' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {item.username}
                                    </Link>
                                }
                                secondary='Gợi ý cho bạn'
                                primaryTypographyProps={{ style: { fontSize: 13 } }}
                                secondaryTypographyProps={{ style: { fontSize: 11 } }} />
                            <ListItemText
                                onClick={() => handleFollowedClick(index)}
                                primary={followedItems[index] ? 'Đã theo dõi' : 'Theo dõi'}
                                primaryTypographyProps={{ style: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', } }}
                                sx={{
                                    marginLeft: 'auto',
                                    color: followedItems[index] ? '#000' : '#0095F6', // Initial text color
                                    cursor: 'pointer',
                                    transition: 'color 0.2s', // Transition for color change
                                    '&:hover': {
                                        color: followedItems[index] ? '#E9E9E9' : '#007bbd', // Light gray for hover on "Đã theo dõi", darker blue for "Theo dõi"
                                    },
                                    '&:active': {
                                        color: followedItems[index] ? '#D3D3D3' : '#005a9e', // Darker gray for active on "Đã theo dõi", darker blue for active on "Theo dõi"
                                    },
                                }}
                            />
                        </ListItem>
                    ))}
                </List>

            </div>
        </Box>
    );
}

export default HomePage;

const itemData = [
    {
        id: '1',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Burger',
        author: '@rollelflex_graphy726',
        type: 'image',
    },
    {
        id: '2',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1522770179533-24471fcdba45', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Camera',
        author: '@helloimnik',
        type: 'image',
    },
    {
        id: '3',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c'],
        title: 'Coffee',
        author: '@nolanissac',
        type: 'video',
    },
    {
        id: '4',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1533827432537-70133748f5c8'],
        title: 'Hats',
        author: '@hjrc33',
        type: 'video',
    },
    {
        id: '5',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62'],
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
        url: ['https://images.unsplash.com/photo-1518756131217-31eb79b20e8f'],
        title: 'Fern',
        author: '@katie_wasserman',
        type: 'video',
    },
    {
        id: '8',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1597645587822-e99fa5d45d25'],
        title: 'Mushrooms',
        author: '@silverdalex',
        type: 'video',
    },
    {
        id: '9',
        username: 'wasabi123',
        date: '12/3/2024',
        url: ['https://images.unsplash.com/photo-1567306301408-9b74779a11af', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
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
        url: ['https://images.unsplash.com/photo-1589118949245-7d38baf380d6', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'],
        title: 'Bike',
        author: '@southside_customs',
        type: 'image',
    },
];