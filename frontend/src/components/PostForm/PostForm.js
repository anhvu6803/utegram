import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MoreForm from '../MoreForm/MoreForm';
import avatar from '../../assets/user.png';

// Cloudinary
import { Cloudinary } from '@cloudinary/url-gen';

//// Material UI 
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, Modal } from '@mui/material';

// Material UI icon
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

const PostForm = ({ postId }) => {
    const item = itemData.find((item) => item.id ===  postId);

    console.log(postId);

    const [liked, setLiked] = useState(false); // Boolean state for a single item

    const handleLikeClick = () => {
        setLiked((prevLiked) => !prevLiked); // Toggle the boolean value
    };

    const [bookmarked, setBookmarked] = useState(false); // Boolean state for a single item

    const handleBookmarkClick = () => {
        setBookmarked((prevbookmarked) => !prevbookmarked); // Toggle the boolean value
    };

    const [userMore, setuserMore] = useState(false);

    const handleUserMoreClick = () => {
        setuserMore((prevuserMore) => !prevuserMore); // Toggle the boolean value
    };

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dbmynlh3f'
        }
    });

    const myVideo = cld.video('ruumym3pwvbqtr3q1dbj').toURL();
    return (
        <div>
            {userMore ? (
                <div style={{ position: 'absolute', left: '900px', zIndex: 1000 }}>
                    <MoreForm />
                </div>) : []
            }
            <Box sx={{ marginLeft: '150px', marginBottom: '50px', marginTop: '30px' }} >
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box sx={{ width: '400px', height: '534px', padding: '0px' }} >
                        {item.type === 'video' ?
                            <video controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                <source src={myVideo} type='video/mp4' />
                            </video> :
                            <img
                                srcSet={`${item.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.url[0]}?w=248&fit=crop&auto=format`}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        }
                    </Box>
                    <Box border={1} borderColor="black" sx={{ backgroundColor: 'white' }}>
                        <ListItem sx={{ width: '100%', height: '40px', padding: '0px', borderBottom: 1 }} >
                            <ListItemAvatar >
                                <Avatar src={avatar} sx={{ color: '#000', width: '30px', height: '30px', marginLeft: '10px' }} />
                            </ListItemAvatar>
                            <Box display="flex" alignItems="center">
                                <ListItemText
                                    primary='wasabi1234'
                                    sx={{ width: 'fit-content' }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#0095F6', marginLeft: 5 }} // marginLeft để tạo khoảng cách giữa primary và secondary
                                >
                                    Theo dõi
                                </Typography>
                            </Box>
                            <IconButton
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => handleUserMoreClick()}

                            >
                                <MoreHorizIcon sx={{ color: '#000', fontSize: 20 }} />
                            </IconButton>

                        </ListItem>
                        <Box sx={{ width: '400px', height: '400px', padding: '0px', borderBottom: 1 }} />
                        <ListItem sx={{ width: '100%', height: '100%', padding: '0px', borderBottom: 1 }}>
                            <IconButton
                                onClick={() => handleLikeClick()}
                            >
                                {liked ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 25 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />}
                            </IconButton>
                            <IconButton
                                onClick={() => { }}
                            >
                                <ChatBubbleOutlineOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />
                            </IconButton>
                            <IconButton
                                onClick={() => { handleBookmarkClick() }}
                                sx={{ marginLeft: 'auto' }}
                            >
                                {bookmarked ? <BookmarkOutlinedIcon sx={{ color: '#000', fontSize: 25 }} /> : <BookmarkBorderOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />}
                            </IconButton>
                        </ListItem>
                        <Box sx={{ width: '400px', height: '50px', padding: '0px' }} />
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
export default PostForm;

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