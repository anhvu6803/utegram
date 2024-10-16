import React, { useState } from 'react';
import MoreForm from '../MoreForm/MoreForm';
import avatar from '../../assets/user.png';

// Cloudinary
import { Cloudinary } from '@cloudinary/url-gen';

//// Material UI 
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Box, Modal } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';

// Material UI icon
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

const PostForm = ({ postId, closeModal }) => {
    const item = itemData.find((item) => item.id === postId);

    const [liked, setLiked] = useState(false); // Boolean state for a single item

    const handleLikeClick = () => {
        setLiked((prevLiked) => !prevLiked); // Toggle the boolean value
    };

    const [bookmarked, setBookmarked] = useState(false); // Boolean state for a single item

    const handleBookmarkClick = () => {
        setBookmarked((prevbookmarked) => !prevbookmarked); // Toggle the boolean value
    };

    const [modalIsOpen, setIsOpen] = useState(false);

    const closeMoreModal = () => {
        setIsOpen(false)
    };

    const [followed, setFollowed] = useState(false);

    const [author, setAuthor] = useState('');

    let [index, setIndexImage] = useState(0);

    const handleIndexImageIncrease = () => {
        index++;
        if (index < item.url.length) {
            setIndexImage(index);
        }
    }

    const handleIndexImageDecrease = () => {
        index--;
        if (index >= 0) {
            setIndexImage(index);
        }
    }



    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dbmynlh3f'
        }
    });

    const myVideo = cld.video('ruumym3pwvbqtr3q1dbj').toURL();
    return (
        <div>
            <Modal open={modalIsOpen} onClose={closeMoreModal} >
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                    <MoreForm closeModal={closeMoreModal} author={author} />
                </Box>
            </Modal>

            <Box sx={{ marginLeft: '50px' }} >
                <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton
                        onClick={() => {
                            closeModal();
                        }}
                        sx={{ position: 'absolute', top: '30px', left: '1370px' }}
                    >
                        <ClearIcon
                            sx={{ color: 'white', fontSize: 25 }}
                        />
                    </IconButton>
                    <ArrowCircleLeftIcon sx={{ marginRight: '100px', color: 'white', fontSize: 40 }} />
                    {item.type === 'video' ?
                        <Box border={1} borderColor="black" sx={{ width: '400px', height: '633.4px', padding: '0px' }} >
                            <video controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                <source src={myVideo} type='video/mp4' />
                            </video>
                        </Box>
                        :
                        <Box
                            display="flex"
                            border={1}
                            borderColor="black"
                            alignItems="center"
                            sx={{ width: '600px', height: '633.4px', padding: '0px', position: 'relative', display: 'inline-block' }}
                        >
                            {index > 0 &&
                                <IconButton
                                    onClick={() => {
                                        handleIndexImageDecrease()
                                    }}
                                    sx={{
                                        position: 'absolute', bottom: '45%', left: '5%',
                                        transform: 'translateX(-50%)',
                                        color: 'white',
                                        fontSize: 25,
                                        zIndex: 1000,
                                    }}
                                >
                                    <ArrowCircleLeftIcon />
                                </IconButton>
                            }
                            <img
                                srcSet={`${item.url[index]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.url[index]}?w=248&fit=crop&auto=format`}
                                loading="lazy"

                                style={{ width: '600px', height: '633.4px', objectFit: 'cover', zIndex: 1 }}
                            />
                            {item.url.length > 1 &&
                                <Box
                                    sx={{
                                        position: 'absolute', bottom: '1%', left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <List>
                                        {Array.from({ length: item.url.length }, (_, i) => (
                                            <ListItem key={i} sx={{ display: 'inline', width: '15px', height: '15px', padding:'2px' }}>
                                                {index === i ?
                                                    <CircleIcon sx={{ color: 'white', fontSize: 8, zIndex: 1000, }} /> :
                                                    <CircleOutlinedIcon sx={{ color: 'white', fontSize: 8, zIndex: 1000, }} />
                                                }
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            }
                            {item.url.length > 1 && index < item.url.length - 1 &&
                                <IconButton
                                    onClick={() => {
                                        handleIndexImageIncrease()
                                    }}
                                    sx={{
                                        position: 'absolute', bottom: '45%', left: '95%',
                                        transform: 'translateX(-50%)',
                                        color: 'white',
                                        fontSize: 25,
                                        zIndex: 1000,
                                    }}
                                >
                                    <ArrowCircleRightIcon />
                                </IconButton>
                            }
                        </Box>

                    }
                    <Box border={1} borderColor="black" sx={{ backgroundColor: 'white' }}>
                        <ListItem sx={{ width: '100%', height: '50px', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB' }} >
                            <Avatar src={avatar} sx={{ color: '#000', width: '30px', height: '30px', marginLeft: '10px' }} />
                            <Box display="flex" alignItems="center">
                                <ListItemText
                                    primary='wasabi1234'
                                    primaryTypographyProps={{ style: { fontSize: 14, textAlign: 'center', } }}
                                    sx={{ width: 'fit-content' }}
                                />
                                <ListItemText
                                    onClick={() => setFollowed(!followed)}
                                    primary={followed ? 'Đã theo dõi' : 'Theo dõi'}
                                    primaryTypographyProps={{ style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', } }}
                                    sx={{
                                        marginLeft: '10px',
                                        color: followed ? '#000' : '#0095F6', // Initial text color
                                        cursor: 'pointer',
                                        transition: 'color 0.2s', // Transition for color change
                                        '&:hover': {
                                            color: followed ? '#E9E9E9' : '#007bbd', // Light gray for hover on "Đã theo dõi", darker blue for "Theo dõi"
                                        },
                                        '&:active': {
                                            color: followed ? '#D3D3D3' : '#005a9e', // Darker gray for active on "Đã theo dõi", darker blue for active on "Theo dõi"
                                        },
                                    }}
                                />
                            </Box>
                            <IconButton
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => {
                                    setIsOpen(true)
                                    setAuthor(item.author)
                                }}

                            >
                                <MoreHorizIcon sx={{ color: '#000', fontSize: 20 }} />
                            </IconButton>

                        </ListItem>
                        <Box sx={{ width: '400px', height: '430px', padding: '0px' }}>
                            <List
                                sx={{
                                    width: '100%',
                                    bgcolor: 'background.paper',
                                    position: 'relative',
                                    overflow: 'auto',
                                    maxHeight: '430px',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                                    },
                                    '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                                    'scrollbar-width': 'none',
                                    '& ul': { padding: 0 },
                                }}
                                subheader={<li />}
                            >
                                {[0, 1, 2, 3, 4].map((sectionId) => (
                                    <li key={`section-${sectionId}`}>
                                        <ul>
                                            <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                                            {[0, 1, 2].map((item) => (
                                                <ListItem key={`item-${sectionId}-${item}`}>
                                                    <ListItemText primary={`Item ${item}`} />
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </List>
                        </Box>

                        <Box sx={{ width: '400px', height: '100px', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB', borderTop: 1, borderTopColor: '#DBDBDB' }}>
                            <ListItem>
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
                        </Box>
                        <Box sx={{ width: '400px', height: '50px', padding: '0px' }} />
                    </Box>
                    <ArrowCircleRightIcon sx={{ marginLeft: '100px', color: 'white', fontSize: 40 }} />
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
        url: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d', 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', 'https://images.unsplash.com/photo-1533827432537-70133748f5c8'],
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