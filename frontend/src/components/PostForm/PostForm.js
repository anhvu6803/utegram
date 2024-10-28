import React, { useState, useRef } from 'react';
import MoreForm from '../MoreForm/MoreForm';
import avatar from '../../assets/user.png';
import { Link } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

// Cloudinary
import { Cloudinary } from '@cloudinary/url-gen';

//// Material UI 
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Box, Modal, Collapse } from '@mui/material';
import TextField from '@mui/material/TextField';

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
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

function calculateDaysFrom(dateString) {

    const [day, month, year] = dateString.split('/').map(Number);

    const givenDate = new Date(year, month - 1, day);

    const currentDate = new Date();

    const timeDifference = currentDate - givenDate.getTime();

    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const countDay = Math.floor(dayDifference / 7);

    return countDay < 1 ? dayDifference + ' ngày' : countDay + ' tuần'
}

const PostForm = ({ postId, closeModal, post, author }) => {
    const item = itemData.find((item) => item.id === postId);

    const userId = '6719efffaddd25d8028d0774';

    const textFieldRef = useRef(null);

    const CommentCoutByPostId = post.comments.length;

    const [likedPost, setLikedPost] = useState(false); // Boolean state for a single item

    const handleLikePostClick = () => {
        setLikedPost((prevLiked) => !prevLiked); // Toggle the boolean value
    };

    const [commentPost, setCommentPost] = useState();

    const handleCommentPost = () => {
        setCommentPost(!commentPost);
        if (textFieldRef.current) {
            textFieldRef.current.focus(); // Step 3: Focus the TextField
        }
    }

    const [bookmarked, setBookmarked] = useState(false); // Boolean state for a single item

    const handleBookmarkClick = () => {
        setBookmarked((prevbookmarked) => !prevbookmarked); // Toggle the boolean value
    };

    const [modalIsOpen, setIsOpen] = useState(false);

    const closeMoreModal = () => {
        setIsOpen(false)
    };

    const [followed, setFollowed] = useState(false);

    const [authorId, setAuthorId] = useState('');

    let [index, setIndexImage] = useState(0);

    if (index >= post.url.length) {
        setIndexImage(0);
    }

    const handleIndexImageIncrease = () => {
        index++;
        if (index < post.url.length) {
            setIndexImage(index);
        }

    }

    const handleIndexImageDecrease = () => {
        index--;
        if (index >= 0) {
            setIndexImage(index);
        }
    }

    const [textComment, setTextCommnent] = useState('');

    const handleTextChange = (event) => {
        setTextCommnent(event.target.value);
    };

    const [typeMoreOption, setTypeMoreOption] = useState('post');

    const captionSplit = post.caption.split(' ');

    //Commnent section

    const itemComment = post.comments;

    const [isReplied, setReplied] = useState(false);

    const handleReplyClick = () => {
        setReplied(!isReplied);
        if (textFieldRef.current) {
            textFieldRef.current.focus(); // Step 3: Focus the TextField
        }
    };

    const [isViewRelied, setViewRelied] = useState();

    const handleViewReliedClick = (index) => {

    };

    const [relyLengthItems] = useState();

    const [likedRelyItems, setLikedRelyItems] = useState();


    const handleLikeRelyClick = (indexComment, indexRely) => {
        // setLikedRelyItems(prevLikedRelyItems => {
        //     // Tạo một bản sao của mảng hiện tại để không thay đổi trực tiếp state cũ
        //     const updatedLikedRelyItems = prevLikedRelyItems.map((commentLikes, commentIndex) =>
        //         commentIndex === indexComment
        //             ? commentLikes.map((replyLiked, replyIndex) =>
        //                 replyIndex === indexRely ? !replyLiked : replyLiked
        //             )
        //             : commentLikes
        //     );

        //     return updatedLikedRelyItems; // Cập nhật trạng thái mới
        // });

    };

    const [likedCommentItems, setLikedCommentItems] = useState();

    const handleLikeCommentClick = (index) => {
        // const updatedLikedItems = likedCommentItems.map((liked, i) =>
        //     i === index ? !liked : liked // Toggle the clicked item only
        // );
        // setLikedCommentItems(updatedLikedItems);
    };


    return (
        <div>
            <Modal open={modalIsOpen} onClose={closeMoreModal} >
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                    <MoreForm
                        closeModal={closeMoreModal}
                        author={authorId}
                        type={typeMoreOption}
                        {...(typeMoreOption === 'post' && { postId })}
                    />
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
                    {post.type === 'video' ?
                        <Box border={1} borderColor="black" sx={{ width: '400px', height: '636px', padding: '0px' }} >
                            <video controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                <source src={post.url[0]} type='video/mp4' />
                            </video>
                        </Box>
                        :
                        <Box
                            display="flex"
                            border={1}
                            borderColor="black"
                            alignItems="center"
                            sx={{ width: '600px', height: '636px', padding: '0px', position: 'relative', display: 'inline-block' }}
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
                                        backgroundColor: 'rgba(51, 51, 51, 0.5)',
                                        fontSize: 25,
                                        zIndex: 1000,
                                    }}
                                >
                                    <ArrowCircleLeftIcon />
                                </IconButton>
                            }
                            <img
                                srcSet={`${post.url[index]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${post.url[index]}?w=248&fit=crop&auto=format`}
                                loading="lazy"

                                style={{ width: '600px', height: '634.5px', objectFit: 'cover', zIndex: 1 }}
                            />
                            {post.url.length > 1 &&
                                <Box
                                    sx={{
                                        position: 'absolute', bottom: '1%', left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <List>
                                        {Array.from({ length: post.url.length }, (_, i) => (
                                            <ListItem key={i} sx={{ display: 'inline', width: '15px', height: '15px', padding: '2px' }}>
                                                {index === i ?
                                                    <CircleIcon sx={{ color: 'white', fontSize: 8, zIndex: 1000, }} /> :
                                                    <CircleOutlinedIcon sx={{ color: 'white', fontSize: 8, zIndex: 1000, }} />
                                                }
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            }
                            {post.url.length > 1 && index < post.url.length - 1 &&
                                <IconButton
                                    onClick={() => {
                                        handleIndexImageIncrease()
                                    }}
                                    sx={{
                                        position: 'absolute', bottom: '45%', left: '95%',
                                        transform: 'translateX(-50%)',
                                        color: 'white',
                                        backgroundColor: 'rgba(51, 51, 51, 0.5)',
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
                        <ListItem sx={{ width: '100%', height: '60px', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB' }} >
                            <Avatar src={author.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px', marginLeft: '10px' }} />
                            <Box display="flex" alignItems="center">
                                <ListItemText
                                    primary={author.username}
                                    primaryTypographyProps={{ style: { fontSize: 14, textAlign: 'center', fontWeight: 'bold' } }}
                                    sx={{ width: 'fit-content' }}
                                />
                                {author.id !== userId &&
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
                                    />}
                            </Box>
                            <IconButton
                                sx={{ marginLeft: 'auto' }}
                                onClick={() => {
                                    setIsOpen(true)
                                    setAuthorId(author.id)
                                    setTypeMoreOption('post')
                                }}

                            >
                                <MoreHorizIcon sx={{ color: '#000', fontSize: 20 }} />
                            </IconButton>

                        </ListItem>
                        <Box
                            sx={{
                                width: '400px', height: '420px', padding: '0px',
                                bgcolor: 'background.paper',
                                position: 'relative',
                                overflow: 'auto',
                                maxHeight: '420px',
                                '&::-webkit-scrollbar': {
                                    display: 'none',  // Ẩn thanh cuộn trên Chrome/Safari
                                },
                                '-ms-overflow-style': 'none',  // Ẩn thanh cuộn trên IE/Edge
                                'scrollbar-width': 'none',
                            }}
                        >
                            {post.caption !== '' &&
                                <Box sx={{
                                    width: '400px',
                                    height: 'auto',
                                    display: 'flex',
                                    marginTop: '10px',
                                }}>
                                    <IconButton
                                        sx={{ width: '40px', height: '40px', marginLeft: '10px' }}
                                        href='/profile'
                                    >
                                        <Avatar src={author.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />
                                    </IconButton>

                                    <Box sx={{ bgcolor: 'background.paper', display: 'flex' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                                            <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: '10px' }}>
                                                <Link to={'/profile'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    {author.username}
                                                </Link>
                                            </span>

                                            <span style={{
                                                marginLeft: '10px',
                                                width: '300px',
                                                height: 'auto',
                                                maxHeight: '420px',
                                                fontSize: 14,
                                                overflow: 'auto',  // Allows scrolling if content exceeds maxHeight
                                                wordWrap: 'break-word',  // Break long words and wrap to the next line
                                                whiteSpace: 'normal',
                                            }}>
                                                {Array.from({ length: captionSplit.length }, (_, i) => (
                                                    <span>
                                                        {captionSplit[i].startsWith('#') ?
                                                            <Link style={{ textDecoration: 'none', color: '#00376B' }} >
                                                                {captionSplit[i] + ' '}
                                                            </Link>
                                                            :
                                                            <span>{captionSplit[i] + ' '}</span>
                                                        }
                                                    </span>
                                                ))}
                                            </span>

                                        </div>
                                    </Box>

                                </Box>
                            }

                            <div>
                                {CommentCoutByPostId > 0 || post.caption ?
                                    <List sx={{ width: '100%' }}>
                                        {Array.from({ length: CommentCoutByPostId }, (_, i) => (
                                            <ListItem sx={{ width: '100%', padding: '0px', marginTop: '20px' }} >
                                                <Box sx={{
                                                    width: '400px',
                                                    height: 'auto',
                                                    display: 'flex',
                                                    marginTop: '10px',
                                                }}>
                                                    <IconButton
                                                        sx={{ width: '40px', height: '40px', marginLeft: '10px' }}
                                                        href='/profile'
                                                    >
                                                        <Avatar src={itemComment[i].url} sx={{ color: '#000', width: '40px', height: '40px' }} />
                                                    </IconButton>

                                                    <IconButton
                                                        sx={{
                                                            width: '15px', height: '15px',
                                                            position: 'absolute', left: '96%',
                                                            transform: 'translateX(-50%)',
                                                        }}
                                                        onClick={() => handleLikeCommentClick(i)}
                                                    >
                                                        {likedCommentItems[i] ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 15 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 15 }} />}
                                                    </IconButton>

                                                    <Box sx={{ bgcolor: 'background.paper', display: 'flex' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                            <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: '10px' }}>
                                                                <Link to={'/profile'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                    {itemComment[i].username}
                                                                </Link>
                                                            </span>

                                                            <span style={{
                                                                marginLeft: '10px',
                                                                width: '300px',
                                                                height: 'auto',
                                                                maxHeight: '420px',
                                                                fontSize: 14,
                                                                overflow: 'auto',  // Allows scrolling if content exceeds maxHeight
                                                                wordWrap: 'break-word',  // Break long words and wrap to the next line
                                                                whiteSpace: 'normal',
                                                            }}>
                                                                {itemComment[i].content}
                                                            </span>

                                                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', marginTop: '10px' }}>
                                                                <span style={{ fontSize: 12, color: '#737373' }}>
                                                                    {calculateDaysFrom(itemComment[i].date)}
                                                                </span>
                                                                {itemComment[i].likes > 0 &&
                                                                    <span style={{ fontSize: 12, color: '#737373', marginLeft: '10px' }}>
                                                                        {itemComment[i].likes + ' lượt thích'}
                                                                    </span>
                                                                }
                                                                <span
                                                                    onClick={() => {
                                                                        handleReplyClick()
                                                                    }}
                                                                    style={{
                                                                        fontSize: 12, color: '#737373',
                                                                        fontWeight: 'bold',
                                                                        marginLeft: '10px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Trả lời
                                                                </span>
                                                                <IconButton
                                                                    sx={{ marginLeft: '10px', height: '15px', width: '15px' }}
                                                                    onClick={() => {
                                                                        setIsOpen(true)
                                                                        setAuthorId(itemComment[i].author)
                                                                        setTypeMoreOption('comment')
                                                                    }}

                                                                >
                                                                    <MoreHorizIcon sx={{ color: '#737373', fontSize: 15 }} />
                                                                </IconButton>
                                                            </div>

                                                            {relyLengthItems[i] > 0 &&
                                                                <div>
                                                                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', marginTop: '20px', alignItems: 'center' }}>
                                                                        <Box sx={{ width: '25px', height: '0.5px', backgroundColor: '#737373' }} />
                                                                        <ListItemText
                                                                            onClick={() => handleViewReliedClick(i)}
                                                                            primary={isViewRelied[i] ? 'Ẩn câu trả lời' : `Xem câu trả lời (${relyLengthItems[i]})`}
                                                                            primaryTypographyProps={{ style: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' } }}
                                                                            sx={{
                                                                                marginLeft: '10px',
                                                                                color: '#737373',
                                                                                cursor: 'pointer',
                                                                                transition: 'color 0.2s',
                                                                                '&:hover': {
                                                                                    color: isViewRelied[i] ? '#E9E9E9' : '#737373',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    <Collapse in={isViewRelied[i]} timeout="auto" unmountOnExit>
                                                                        <List>
                                                                            {itemComment[i].replies.map((item, index) => (
                                                                                <ListItem sx={{ width: '100%', padding: '0px', marginTop: '20px' }} >
                                                                                    <Box sx={{
                                                                                        width: '350px',
                                                                                        height: 'auto',
                                                                                        display: 'flex',
                                                                                    }}>
                                                                                        <IconButton
                                                                                            sx={{ width: '40px', height: '40px', marginLeft: '10px' }}
                                                                                            href='/profile'
                                                                                        >
                                                                                            <Avatar src={item.url} sx={{ color: '#000', width: '40px', height: '40px' }} />
                                                                                        </IconButton>

                                                                                        <IconButton
                                                                                            sx={{
                                                                                                width: '15px', height: '15px',
                                                                                                position: 'absolute', left: '96%',
                                                                                                transform: 'translateX(-50%)',
                                                                                            }}
                                                                                            onClick={() => { handleLikeRelyClick(i, index) }}
                                                                                        >
                                                                                            {likedRelyItems[i][index] ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 15 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 15 }} />}
                                                                                        </IconButton>

                                                                                        <Box sx={{ bgcolor: 'background.paper', display: 'flex' }}>
                                                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                                                                <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: '10px' }}>
                                                                                                    <Link to={'/profile'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                                                        {item.username}
                                                                                                    </Link>
                                                                                                </span>

                                                                                                <span style={{
                                                                                                    marginLeft: '10px',
                                                                                                    width: '250px',
                                                                                                    height: 'auto',
                                                                                                    maxHeight: '420px',
                                                                                                    fontSize: 14,
                                                                                                    overflow: 'auto',  // Allows scrolling if content exceeds maxHeight
                                                                                                    wordWrap: 'break-word',  // Break long words and wrap to the next line
                                                                                                    whiteSpace: 'normal',
                                                                                                }}>
                                                                                                    {item.content}
                                                                                                </span>

                                                                                                <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', marginTop: '10px' }}>
                                                                                                    <span style={{ fontSize: 12, color: '#737373' }}>
                                                                                                        {calculateDaysFrom(item.date)}
                                                                                                    </span>
                                                                                                    {item.likes > 0 &&
                                                                                                        <span style={{ fontSize: 12, color: '#737373', marginLeft: '10px' }}>
                                                                                                            {item.likes + ' lượt thích'}
                                                                                                        </span>
                                                                                                    }
                                                                                                    <span
                                                                                                        onClick={() => {
                                                                                                            handleReplyClick()
                                                                                                        }}
                                                                                                        style={{
                                                                                                            fontSize: 12, color: '#737373',
                                                                                                            fontWeight: 'bold',
                                                                                                            marginLeft: '10px',
                                                                                                            cursor: 'pointer'
                                                                                                        }}
                                                                                                    >
                                                                                                        Trả lời
                                                                                                    </span>
                                                                                                    <IconButton
                                                                                                        sx={{ marginLeft: '10px', height: '15px', width: '15px' }}
                                                                                                        onClick={() => {
                                                                                                            setIsOpen(true)
                                                                                                            setAuthorId(itemComment[i].author)
                                                                                                            setTypeMoreOption('comment')
                                                                                                        }}

                                                                                                    >
                                                                                                        <MoreHorizIcon sx={{ color: '#737373', fontSize: 15 }} />
                                                                                                    </IconButton>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Box>
                                                                                    </Box>
                                                                                </ListItem>
                                                                            ))}
                                                                        </List>
                                                                    </Collapse>
                                                                </div>
                                                            }
                                                        </div>
                                                    </Box>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                    :
                                    <Box sx={{ width: '400px', height: '420px', bgcolor: 'background.paper', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 24, fontWeight: 'bold' }}>Chưa có bình luận nào.</span>
                                            <span style={{ fontSize: 14, marginLeft: '70px', marginTop: '10px' }}>Bắt đầu trò chuyện.</span>
                                        </div>
                                    </Box>
                                }
                            </div>
                        </Box>

                        <Box sx={{ width: '400px', height: '100px', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB', borderTop: 1, borderTopColor: '#DBDBDB', display: 'flex', flexDirection: 'column' }}>
                            <ListItem
                                sx={{
                                    width: '400px', height: '25px', padding: '0px', marginTop: '15px'
                                }}
                            >
                                <IconButton
                                    onClick={() => handleLikePostClick()}
                                >
                                    {likedPost ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 25 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 25 }} />}
                                </IconButton>
                                <IconButton
                                    onClick={() => { handleCommentPost() }}
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
                            <span style={{ fontSize: 14, fontWeight: 'bold', marginTop: '20px', marginLeft: '10px' }}>21.900 Lượt thích</span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: '#737373',
                                    fontWeight: 'normal',
                                    marginLeft: '10px',
                                    marginTop: '5px'
                                }}>
                                21 tháng 9 2024
                            </span>
                        </Box>
                        <Box sx={{ width: '400px', height: '55px', padding: '0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <SentimentSatisfiedAltIcon sx={{ fontSize: 30, marginLeft: '10px' }} />
                            <Box
                                sx={{
                                    width: '300px', height: 'auto',
                                    padding: '0px', display: 'flex',
                                    overflow: 'auto',
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    maxRows={2}
                                    placeholder="Thêm bình luận..."
                                    value={textComment}
                                    onChange={handleTextChange}
                                    inputRef={textFieldRef}
                                    slotProps={{
                                        input: {
                                            sx: {
                                                height: '100%',
                                                overflow: 'auto',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', // Ẩn border của TextField
                                                },
                                            },
                                        }
                                    }}
                                />
                            </Box>
                            <ListItemText
                                onClick={() => { }}
                                primary={'Đăng'}
                                primaryTypographyProps={{ style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginLeft: '10px' } }}
                                sx={{
                                    marginLeft: 'auto',
                                    color: textComment.trim() ? '#0095F6' : '#AACFDD',
                                    cursor: textComment.trim() ? 'pointer' : 'default',
                                    transition: 'color 0.2s',
                                    '&:hover': {
                                        color: '#AACFDD',
                                    },
                                }}
                            />
                        </Box>
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

const commentData = [
    {
        postId: '10',
        username: 'wasabi123',
        content: 'niceaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        likes: 10,
        author: '@rollelflex_graphy726',
        replies: [
            {
                username: 'wasabi123',
                content: 'niceaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                date: '12/3/2024',
                url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                likes: 1,
                author: '@rollelflex_1',
            },
            {
                username: 'wasabi123',
                content: 'nice',
                date: '12/3/2024',
                url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                likes: 1,
                author: '@rollelflex_2',
            },
        ]
    },
    {
        postId: '10',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        likes: 10,
        author: '@rollelflex_graphy726',
        replies: [
            {
                username: 'wasabi123',
                content: 'nice',
                date: '12/3/2024',
                url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                likes: 1,
                author: '@rollelflex_2',
            },
        ]
    },
    {
        postId: '2',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        likes: 15,
        author: '@helloimnik',
        replies: []
    },
    {
        postId: '3',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        likes: 0,
        author: '@nolanissac',
        replies: []
    },
    {
        postId: '4',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        likes: 0,
        author: '@hjrc33',
        replies: []
    },
    {
        postId: '5',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        likes: 0,
        author: '@arwinneil',
        replies: []
    },
    {
        postId: '6',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        likes: 2,
        author: '@tjdragotta',
        replies: []
    },
    {
        postId: '7',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        likes: 5,
        author: '@katie_wasserman',
        replies: []
    },
    {
        postId: '8',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        likes: 1,
        author: '@silverdalex',
        replies: []
    },
    {
        postId: '9',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        likes: 0,
        author: '@shelleypauls',
        replies: []
    },
    {
        postId: '10',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        likes: 0,
        author: '@peterlaster',
        replies: [
            {
                username: 'wasabi123',
                content: 'nice',
                date: '12/3/2024',
                url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                likes: 1,
                author: '@rollelflex_2',
            },
            {
                username: 'wasabi123',
                content: 'nice',
                date: '12/3/2024',
                url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                likes: 1,
                author: '@rollelflex_2',
            },
            {
                username: 'wasabi123',
                content: 'nice',
                date: '12/3/2024',
                url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
                likes: 1,
                author: '@rollelflex_2',
            },
        ]
    },
    {
        postId: '11',
        username: 'wasabi123',
        content: 'nice',
        date: '12/3/2024',
        url: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        likes: 0,
        author: '@southside_customs',
        replies: []
    },
];