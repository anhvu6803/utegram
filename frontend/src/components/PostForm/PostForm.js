import React, { useState, useRef, useContext, useEffect } from 'react';
import MoreForm from '../MoreForm/MoreForm';
import avatar from '../../assets/user.png';
import ListUserLiked from './ListUserLiked';
import { Link } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import io from 'socket.io-client';

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

const socket = io.connect('http://localhost:5000');

function calculateDaysFrom(mongoDate) {

    const givenDate = new Date(mongoDate);

    const currentDate = new Date();

    const timeDifference = currentDate - givenDate;

    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const weekDifference = Math.floor(dayDifference / 7);

    return dayDifference === 0 ? 'Hôm nay' : (weekDifference < 1 ? dayDifference + ' ngày' : weekDifference + ' tuần');
}

const PostForm = ({ postId, closeModal, post, author, listComments, listReplies }) => {
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = auth.userId;

    const textFieldRef = useRef(null);

    const [likedPost, setLikedPost] = useState(post.likes.includes(userId)); // Boolean state for a single item
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [isViewUserLiked, setViewUserLiked] = useState(false);
    const [listUserLiked, setListUserLiked] = useState([]);
    const [modalListUserLiked, setOpenListUserLiked] = useState(false);

    const closeListUserLiked = () => {
        setOpenListUserLiked(false)
    }

    const handleLikePostClick = async (e) => {
        e.preventDefault();
        const newLikedStatus = !likedPost;
        setLikedPost(newLikedStatus); // Toggle the boolean value
        setLikeCount((prevCount) => newLikedStatus ? prevCount + 1 : prevCount - 1);

        try {
            await sendRequest(
                `http://localhost:5000/api/posts/${post._id}/like`,
                'POST',
                JSON.stringify({ userId: auth.userId }),
                { 'Content-Type': 'application/json' }
            );
            // Phát sự kiện qua Socket.IO
            socket.emit('likePost', post._id);
        } catch (err) {
            // Phục hồi trạng thái cũ nếu có lỗi
            setLikedPost(!newLikedStatus);
            setLikeCount((prevCount) => newLikedStatus ? prevCount - 1 : prevCount + 1);
        }
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

    const [typeMoreOption, setTypeMoreOption] = useState('post');

    const captionSplit = post.caption.split(' ');

    //Commnent section

    //comment
    const [commentPost, setCommentPost] = useState(false);
    const [textComment, setTextCommnent] = useState('');
    const [_listComments, setListComment] = useState(listComments.map((item) => item));
    const [handleCommentOnce, setHandleCommentOnce] = useState(1);
    const [likedCommentItems, setLikedCommentItems] = useState(listComments?.map((item) => item.likes.includes(userId)));
    const [likedCommentItemsCount, setLikedCommentItemsCount] = useState(listComments?.map((item) => item.likes.length));

    //replies
    const [isReplied, setReplied] = useState(false);
    const [parentCommentId, setParentCommentId] = useState('');
    const [handleReplyOnce, setHandleReplyOnce] = useState(1);
    const [newReply, setNewReply] = useState();
    const [isViewRelied, setViewRelied] = useState(listComments.map(() => false));
    const [listReliesComment, setListReliesComment] = useState(listReplies)
    const [likedReplyItems, setLikedReplyItems] = useState(listReplies?.map((item) => item.map((item) => item.likes.includes(userId))))
    const [likedReplyItemsCount, setLikedReplyItemsCount] = useState(listReplies?.map((item) => item.map((item) => item.likes.length)));

    console.log(listReliesComment)
    const handleTextChange = (event) => {
        setTextCommnent(event.target.value);
    };

    const handleCommentPost = () => {
        setCommentPost(!commentPost);
        if (textFieldRef.current) {
            textFieldRef.current.focus(); // Step 3: Focus the TextField
        }
    }

    const handleReplyClick = (index) => {
        setParentCommentId(_listComments[index]._id);

        setReplied(!isReplied);

        if (textFieldRef.current) {
            textFieldRef.current.focus(); // Step 3: Focus the TextField
        }
    };

    const commentSubmitHandler = async event => {
        event.preventDefault();
        if (commentPost) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/comment/',
                    'POST',
                    JSON.stringify({
                        text: textComment,
                        author: userId,
                        post: post._id
                    }),
                    { 'Content-Type': 'application/json' }
                );
                socket.emit('submitComment', responseData);
                setTextCommnent('');
                setCommentPost(false)
            } catch (err) { }
        }
        else if (isReplied) {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/comment/${parentCommentId}/reply`,
                    'POST',
                    JSON.stringify({
                        text: textComment,
                        author: userId,
                        post: post._id
                    }),
                    { 'Content-Type': 'application/json' }
                );
                socket.emit('submitReply', responseData);
                setTextCommnent('');
                setReplied(false);
            } catch (err) { }
        }
    };

    const handleViewReliedClick = (index) => {
        const updatedViewRelied = isViewRelied.map((viewed, i) =>
            i === index ? !viewed : viewed // Toggle the clicked item only
        );
        setViewRelied(updatedViewRelied);
    };

    const handleLikeRelyClick = async (indexComment, indexReply, event) => {
        event.preventDefault();
        const updateLikedReplItems = likedReplyItems.map((item, index) => {
            if (index === indexComment) {
                const likedItems = item.map((item, index) => index === indexReply ? !item : item);
                return likedItems;
            }
            else {
                return item;
            }
        })
        setLikedReplyItems(updateLikedReplItems);

        try {
            await sendRequest(
                `http://localhost:5000/api/comment/${listReliesComment[indexComment][indexReply]._id}/like`,
                'POST',
                JSON.stringify({ userId: auth.userId }),
                { 'Content-Type': 'application/json' }
            );
            socket.emit('likeComment', _listComments[index]._id);

        } catch (err) {

        }
    };

    const [likeCountComment, setLikeCountComment] = useState(null);

    const handleLikeCommentClick = async (index, e) => {
        e.preventDefault();
        const newLikedStatus = !likedCommentItems[index];
        const updatedLikedItems = likedCommentItems.map((liked, i) =>
            i === index ? !liked : liked // Toggle the clicked item only
        );
        setLikedCommentItems(updatedLikedItems);
        const updatedLikedItemsCount = likedCommentItemsCount.map((likedCount, i) =>
            i === index ? (newLikedStatus ? likedCount + 1 : likedCount - 1) : likedCount // Toggle the clicked item only
        );
        setLikedCommentItemsCount(updatedLikedItemsCount)

        try {
            await sendRequest(
                `http://localhost:5000/api/comment/${_listComments[index]._id}/like`,
                'POST',
                JSON.stringify({ userId: auth.userId }),
                { 'Content-Type': 'application/json' }
            );
            socket.emit('likeComment', _listComments[index]._id);

        } catch (err) {

        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseUser = await sendRequest(`http://localhost:5000/api/posts/like/${post._id}`);

                setListUserLiked(responseUser.users);
            } catch (err) { }
        };
        fetchUsers();



        socket.on('updateLikes', (data) => {
            if (data.postId === post._id && data.likesCount >= 0) {
                setLikeCount(data.likesCount);
                if (data.message === 'Post liked') {
                    setListUserLiked((list) => [...list, data.user])
                }
                else if (data.message === 'Post unliked') {
                    setListUserLiked((list) => list.filter((item) => item._id !== data.user._id))
                }
            }
        });

        socket.on('updateLikesComment', (data) => {
            if (data.likesCount >= 0) {
                setLikeCountComment(data)
            }
        });

        // Dọn dẹp socket khi component unmount
        return () => {
            socket.off('updateLikes');
            socket.off('updateLikesComment');
        };
    }, [post._id, sendRequest]);

    useEffect(() => {
        socket.on('updateComment', (data => {
            if (handleCommentOnce === 1) {
                setListComment((list) => [...list, data.comment.comment]);
                setLikedCommentItems((list) => [...list, data.comment.comment.likes.includes(userId)])
                setLikedCommentItemsCount((list) => [...list, data.comment.comment.likes.length])
                setListReliesComment((list) => [...list, data.comment.comment.replies])
                setViewRelied((list) => [...list, false])
                setLikedReplyItems((list) => [...list, []])
                setHandleCommentOnce(1)
            }
        }))

        socket.on('updateReply', (data => {
            if (handleReplyOnce === 1) {
                const findIndexReply = _listComments.findIndex((item) => item._id === data.reply?.commentId)

                console.log(findIndexReply)
                const updateListRepies = !data.reply ? listReliesComment :
                    listReliesComment.map((replies, i) => {
                        if (i === findIndexReply) {
                            const newReplies = [...replies, newReply?.comment];
                            return newReplies;
                            // Return a new array with `newReply` added
                        }
                        return replies; // Return the original replies array for non-matching indexes
                    });
                console.log(listReliesComment)

                const updateListLikedRepies = !data.reply ? likedReplyItems :
                    likedReplyItems.map((liked, i) => {
                        if (i === findIndexReply) {
                            return [...liked, false]; // Return a new array with `newReply` added
                        }
                        return liked; // Return the original replies array for non-matching indexes
                    });
                setLikedReplyItems(updateListLikedRepies)
                setListReliesComment(updateListRepies)
                setHandleReplyOnce(1);
            }
        }))

        return () => {
            socket.off('updateComment');
            socket.off('updateReply');
        };

    }, [_listComments, likedCommentItems, likedCommentItemsCount]);

    const findIndex = _listComments.findIndex((item) => item._id === likeCountComment?.commentId)
    const updatedLikedItemsCount = !likeCountComment ? likedCommentItemsCount :
        likedCommentItemsCount.map((likedCount, i) =>
            i === findIndex ? likeCountComment?.likesCount : likedCount // Toggle the clicked item only
        );

    console.log(listReplies)

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

                                            <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px' }}>
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
                                {_listComments.length > 0 || post.caption ?
                                    <List sx={{ width: '100%' }}>
                                        {Array.from({ length: _listComments.length }, (_, i) => (
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
                                                        <Avatar src={_listComments[i].author.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />
                                                    </IconButton>

                                                    <IconButton
                                                        sx={{
                                                            width: '15px', height: '15px',
                                                            position: 'absolute', left: '96%',
                                                            transform: 'translateX(-50%)',
                                                        }}
                                                        onClick={(event) => { handleLikeCommentClick(i, event) }}
                                                    >
                                                        {likedCommentItems[i] ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 15 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 15 }} />}
                                                    </IconButton>

                                                    <Box sx={{ bgcolor: 'background.paper', display: 'flex' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                            <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px' }}>
                                                                <Link to={'/profile'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                    {_listComments[i].author.username}
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
                                                                {_listComments[i].text}
                                                            </span>

                                                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', marginTop: '10px' }}>
                                                                <span style={{ fontSize: 12, color: '#737373' }}>
                                                                    {calculateDaysFrom(_listComments[i].createdAt)}
                                                                </span>
                                                                {updatedLikedItemsCount[i] > 0 &&
                                                                    <span style={{ fontSize: 12, color: '#737373', marginLeft: '10px' }}>
                                                                        {updatedLikedItemsCount[i] + ' lượt thích'}
                                                                    </span>
                                                                }
                                                                <span
                                                                    onClick={() => {
                                                                        handleReplyClick(i)
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
                                                                        setAuthorId(_listComments[i].author.id)
                                                                        setTypeMoreOption('comment')
                                                                    }}

                                                                >
                                                                    <MoreHorizIcon sx={{ color: '#737373', fontSize: 15 }} />
                                                                </IconButton>
                                                            </div>

                                                            {listComments[i]?.length > 0 &&
                                                                <div>
                                                                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', marginTop: '20px', alignItems: 'center' }}>
                                                                        <Box sx={{ width: '25px', height: '0.5px', backgroundColor: '#737373' }} />
                                                                        <ListItemText
                                                                            onClick={() => handleViewReliedClick(i)}
                                                                            primary={isViewRelied[i] ? 'Ẩn câu trả lời' : `Xem câu trả lời (${listReliesComment[i]?.length})`}
                                                                            primaryTypographyProps={{ style: { fontSize: 12, fontWeight: 'bold' } }}
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

                                                                    {/* <Collapse in={isViewRelied[i]} timeout="auto" unmountOnExit>
                                                                        <List>
                                                                            {listReliesComment[i].map((item, index) => (
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
                                                                                            <Avatar src={item.author.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />
                                                                                        </IconButton>

                                                                                        <IconButton
                                                                                            sx={{
                                                                                                width: '15px', height: '15px',
                                                                                                position: 'absolute', left: '96%',
                                                                                                transform: 'translateX(-50%)',
                                                                                            }}
                                                                                            onClick={(event) => { handleLikeRelyClick(i, index, event) }}
                                                                                        >
                                                                                            {likedReplyItems[i][index] ? <FavoriteOutlinedIcon sx={{ color: '#ED4956', fontSize: 15 }} /> : <FavoriteBorderOutlinedIcon sx={{ color: '#000', fontSize: 15 }} />}
                                                                                        </IconButton>

                                                                                        <Box sx={{ bgcolor: 'background.paper', display: 'flex' }}>
                                                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                                                                <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: '10px' }}>
                                                                                                    <Link to={'/profile'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                                                        {item.author.username}
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
                                                                                                    {item.text}
                                                                                                </span>

                                                                                                <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', marginTop: '10px' }}>
                                                                                                    <span style={{ fontSize: 12, color: '#737373' }}>
                                                                                                        {calculateDaysFrom(item.createdAt)}
                                                                                                    </span>
                                                                                                    {item.likes.length > 0 &&
                                                                                                        <span style={{ fontSize: 12, color: '#737373', marginLeft: '10px' }}>
                                                                                                            {item.likes.length + ' lượt thích'}
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
                                                                                                            setAuthorId(item.author.id)
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
                                                                    </Collapse> */}
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
                                    onClick={handleLikePostClick}
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
                            <span
                                style={{
                                    fontSize: 14, fontWeight: 'normal',
                                    marginTop: '20px', marginLeft: '10px'
                                }}>
                                {likeCount > 0 ?
                                    <div>
                                        <span
                                            style={{
                                                fontSize: 14, fontWeight: 'bold',
                                                marginTop: '20px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => { setOpenListUserLiked(true) }}
                                        >
                                            {likeCount + ' lượt thích'}
                                        </span>

                                        <Modal open={modalListUserLiked} onClose={closeListUserLiked} >
                                            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>

                                                <ListUserLiked
                                                    listUser={listUserLiked}
                                                    closeModal={closeListUserLiked}
                                                />
                                            </Box>
                                        </Modal>


                                    </div>

                                    :
                                    <div>
                                        Hãy là người đầu tiên
                                        <span
                                            style={{
                                                fontSize: 14, fontWeight: 'bold',
                                                marginTop: '20px', marginLeft: '5px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={handleLikePostClick}
                                        >
                                            thích bài viết
                                        </span>
                                    </div>

                                }
                            </span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: '#737373',
                                    fontWeight: 'normal',
                                    marginLeft: '10px',
                                    marginTop: '5px'
                                }}>
                                {calculateDaysFrom(post.createdAt)}
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
                                    onClick={() => {
                                        setCommentPost(true)
                                        setReplied(false)
                                    }}
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
                            <form
                                onSubmit={commentSubmitHandler}
                            >
                                <button
                                    type='submit'
                                    disabled={!textComment.trim()}
                                    style={{
                                        fontSize: 15, fontWeight: 'normal',
                                        marginLeft: 'auto',
                                        color: textComment.trim() ? '#0095F6' : '#AACFDD',
                                        cursor: textComment.trim() ? 'pointer' : 'default',
                                        background: 'none',
                                        border: 'none',
                                        transition: 'color 0.2s',
                                        '&:hover': {
                                            color: '#AACFDD',
                                        },
                                    }}
                                >
                                    Đăng
                                </button>
                            </form>
                            {/* <ListItemText
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
                            /> */}
                        </Box>
                    </Box>
                </Box>
            </Box >
        </div >
    );
}
export default PostForm;
