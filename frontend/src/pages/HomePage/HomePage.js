import React, { useState, useEffect } from 'react';
import './HomePage.css';
import OptionBar from '../../components/OptionBar/OptionBar'

//Cloudinary
import {AdvancedVideo} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import {Gravity} from "@cloudinary/url-gen/qualifiers";
import {AutoFocus} from "@cloudinary/url-gen/qualifiers/autoFocus";


//// Material UI 
import List from '@mui/material/List';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Box, Typography } from '@mui/material';

// Material UI icon
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

const HomePage = () => {
    const [likedItems, setLikedItems] = useState(itemData.map(() => false));

    const handleLikeClick = (index) => {
        const updatedLikedItems = likedItems.map((liked, i) =>
            i === index ? !liked : liked // Toggle the clicked item only
        );
        setLikedItems(updatedLikedItems);
    };

    const [bookMarkItems, setBookMarkItems] = useState(itemData.map(() => false));

    const handleBookMarkClick = (index) => {
        const updatedBookMarkedItems = bookMarkItems.map((bookMarked, i) =>
            i === index ? !bookMarked : bookMarked // Toggle the clicked item only
        );
        setBookMarkItems(updatedBookMarkedItems);
    };

    const cld = new Cloudinary({
        cloud: {
          cloudName: 'dbmynlh3f'
        }
      }); 

    const myVideo = cld.video('ruumym3pwvbqtr3q1dbj').toURL();

    const img = cld
        .image('cld-sample-5')
        .format('auto')
        .quality('auto');

    return (
        <div>
            <OptionBar />
            <div className='home-container'>
                <List cols={1} sx={{ width: '900px', height: '100%' }}>
                    {itemData.map((item, index) => (
                        <ListItem key={item.img} sx={{ marginLeft: '150px', marginBottom: '50px', marginTop: '30px' }}>

                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Box sx={{ width: '400px', height: '534px', padding: '0px' }} >
                                    {/* <AdvancedImage image={img}
                                        loading="lazy"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    /> */}
                                    {/* <AdvancedVideo cldVid={myVideo} cldPoster={myVideo.format('jpg')} controls autoPlay/> */}
                                    <video controls autoPlay  style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                        <source src={myVideo} type='video/mp4'/>
                                    </video>
                                </Box>
                                <Box border={1} borderColor="black" >
                                    <ListItem sx={{ width: '100%', height: '40px', padding: '0px', borderBottom: 1 }} >
                                        <ListItemAvatar >
                                            <Avatar src={item.avatar} sx={{ color: '#000', width: '30px', height: '30px', marginLeft: '10px' }} />
                                        </ListItemAvatar>
                                        <Box display="flex" alignItems="center">
                                            <ListItemText
                                                primary={item.username}
                                                sx={{ width: 'fit-content' }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#0095F6', marginLeft: 5 }} // marginLeft để tạo khoảng cách giữa primary và secondary
                                            >
                                                Theo dõi
                                            </Typography>
                                        </Box>
                                        <IconButton sx={{ marginLeft: 'auto' }}>
                                            <MoreHorizIcon sx={{ color: '#000', fontSize: 20 }} />
                                        </IconButton>

                                    </ListItem>
                                    <Box sx={{ width: '400px', height: '400px', padding: '0px', borderBottom: 1 }} />
                                    <ListItem sx={{ width: '100%', height: '100%', padding: '0px', borderBottom: 1 }}>
                                        <IconButton
                                            onClick={() => handleLikeClick(index)}
                                        >
                                            {likedItems[index] ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 25 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />}
                                        </IconButton>
                                        <IconButton
                                            onClick={() => { }}
                                        >
                                            <ChatBubbleOutlineOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => { handleBookMarkClick(index) }}
                                            sx={{ marginLeft: 'auto' }}
                                        >
                                            {bookMarkItems[index] ? <BookmarkOutlinedIcon sx={{ color: '#000', fontSize: 25 }} /> : <BookmarkBorderOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />}
                                        </IconButton>
                                    </ListItem>
                                    <Box sx={{ width: '400px', height: '50px', padding: '0px' }} />
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div >
    );
}

export default HomePage;

const itemData = [
    {
        username: 'wasabi123',
        date: '12/3/2024',
        video: 'https://drive.google.com/file/d/1-CH55SyMirhBeEBB7gbLFHUPBos8S2K4/view?usp=sharing',
        //img: 'https://youtu.be/LIgldcjERSk',
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
        author: '@rollelflex_graphy726',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
        author: '@helloimnik',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
        author: '@nolanissac',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
        author: '@hjrc33',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
        author: '@arwinneil',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
        author: '@tjdragotta',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
        author: '@katie_wasserman',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
        author: '@silverdalex',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
        author: '@shelleypauls',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
        author: '@peterlaster',
    },
    {
        username: 'wasabi123',
        date: '12/3/2024',
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
        author: '@southside_customs',
    },
];