import React, { useState } from 'react';
import './HomePage.css';
import OptionBar from '../../components/OptionBar/OptionBar';
import avatar from '../../assets/user.png';


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
import { Box, Button, Typography } from '@mui/material';

// Material UI icon
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

const HomePage = () => {

    return (
        <div>
            <OptionBar />
            <div className='appname'>
                Bài viết gợi ý
            </div>
            <div className='home-container'>
                <ImageList cols={2} sx={{ width: '620px', height: '100%', marginTop: '50px' }}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                            <img
                                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.img}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                                style={{ width: '300px', height: '300px' }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <List sx={{ width: '300px', height: '100%', marginLeft: '100px', marginTop: '30px'}}>
                    <ListItemText
                        primary='Gợi ý cho bạn'
                        primaryTypographyProps={{ style: { fontSize: 13, fontWeight: 'bold' } }}/>
                    {itemData.map((item) => (
                        <ListItem>
                            <ListItemAvatar>
                                <IconButton sx={{ width: '30px', height: '30px' }}>
                                    <Avatar src={avatar} sx={{ color: '#000', width: '30px', height: '30px' }} />
                                </IconButton>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.username}
                                secondary='21,5 triệu người theo dõi'
                                primaryTypographyProps={{ style: { fontSize: 13 } }}
                                secondaryTypographyProps={{ style: { fontSize: 11 } }} />
                            <ListItemButton sx={{ width: 'auto' }}>
                                <ListItemText
                                    primary='Theo dõi'
                                    primaryTypographyProps={{ style: { fontSize: 11, fontWeight: 'bold' } }}
                                    sx={{ marginLeft: 'auto', color: '#0095F6' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </div>
        </div>
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