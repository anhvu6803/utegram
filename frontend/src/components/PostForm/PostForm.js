import React, { useState } from 'react';
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
import { Box, Typography } from '@mui/material';

// Material UI icon
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';

let userMoreSelectedIndex;
const PostForm = () => {

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
            <Box sx={{ marginLeft: '150px', marginBottom: '50px', marginTop: '30px' }}>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box sx={{ width: '400px', height: '534px', padding: '0px' }} >
                        {/* <AdvancedImage image={img}
                                        loading="lazy"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    /> */}
                        {/* <AdvancedVideo cldVid={myVideo} cldPoster={myVideo.format('jpg')} controls autoPlay/> */}
                        <video controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src={myVideo} type='video/mp4' />
                        </video>
                    </Box>
                    <Box border={1} borderColor="black" >
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