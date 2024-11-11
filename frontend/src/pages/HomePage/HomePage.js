import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import OptionBar from '../../components/OptionBar/OptionBar';
import avatar from '../../assets/user.png';
import PostForm from '../../components/PostForm/PostForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

//// Material UI 
import List from '@mui/material/List';
import ImageList from '@mui/material/ImageList';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Modal, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material icon
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { ListItemButton } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const HomePage = () => {
    const auth = useContext(AuthContext);

    const userId = auth.userId;

    console.log(userId)

    const { timeLoading, sendRequest } = useHttpClient();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedUsers, setLoadedUsers] = useState();
    const [loadedPosts, setLoadedPosts] = useState();
    useEffect(() => {
        const fetchHomePage = async () => {
            setIsLoading(true)

            try {
                const responseUsers = await sendRequest(`http://localhost:5000/api/users/morepost/${userId}`);

                setLoadedUsers(responseUsers.users);
                setLoadedPosts(responseUsers.posts);

                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);

            } catch (err) {
                setTimeout(() => {
                    setIsLoading(false);
                }, timeLoading * 1000 + 1000);
            }
        };
        fetchHomePage();
    }, [sendRequest]);

    console.log(loadedUsers)
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

    const handleIncreseIndex = (itemData) => {
        indexPostNext++
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    }
    const handleDecreseIndex = (itemData) => {
        indexPostNext--;
        if (indexPostNext < itemData.length) {
            setIndexPostNext(indexPostNext);
        }
    }

    const [loadedPost, setLoadedPost] = useState();
    const [loadedUser, setLoadedUser] = useState();
    const [listComments, setListComment] = useState([]);
    const [listReliesComment, setListReliesComment] = useState([])
    const [isLoadingPost, setLoadingPost] = useState(false);
    const handleLoadPost = async (event, id) => {
        event.preventDefault();
        setLoadingPost(true);
        setLoadedPost();
        setLoadedUser();
        setListComment([]);
        setListReliesComment([]);
        try {
            const responsePost = await sendRequest(`http://localhost:5000/api/posts/${id}`);

            setLoadedPost(responsePost.post);

            const responseUser = await sendRequest(`http://localhost:5000/api/auth/${responsePost.post.author}`);

            setLoadedUser(responseUser.user);

            const responseComments = await sendRequest(`http://localhost:5000/api/posts/comment/${id}`);

            setListComment(responseComments.comments);

            const responsesReplies = await Promise.all(
                responseComments.comments.map(async (item) => {
                    if (item.replies.length > 0) {
                        const responseReplies = await sendRequest(`http://localhost:5000/api/comment/reply/${item._id}`);

                        return responseReplies.replies;
                    }
                    else {
                        return [];
                    }
                })
            );

            setListReliesComment(responsesReplies)

            setTimeout(() => {
                setLoadingPost(false);
            }, timeLoading * 1000 + 1000);

        } catch (err) {
            setTimeout(() => {
                setLoadingPost(false);
            }, timeLoading * 1000 + 1000);
        }
    }

    const closeModal = () => setIsOpen(false);

    console.log(isLoadingPost)
    console.log(`Time taken to load: ${timeLoading * 1000 + 1000} seconds`);
    console.log(loadedPost)
    console.log(loadedUser)

    return (
        <Box sx={{ position: 'absolute', top: 0 }}>
            <OptionBar pages={'home'} />
            <div className='appname'>
                Bài viết gợi ý
            </div>
            {isLoading ?
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="center"
                    sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                    loadingIndicator={
                        <CircularProgress
                            size={500} // Set the size of the loading indicator
                            sx={{ color: '#f09433' }} // Optional: change color to match your design
                        />
                    }
                >
                </LoadingButton>
                :
                <Box sx={{
                    width: '1000px',
                    height: '100%',
                    display: 'flex',
                    marginLeft: '400px'
                }}>
                    <Modal open={modalIsOpen} onClose={closeModal} >
                        {isLoadingPost ?
                            <LoadingButton
                                loading={isLoadingPost}
                                loadingPosition="center"
                                sx={{ height: '500px', marginLeft: '800px', marginTop: '100px' }}
                                loadingIndicator={
                                    <CircularProgress
                                        size={500} // Set the size of the loading indicator
                                        sx={{ color: '#f09433' }} // Optional: change color to match your design
                                    />
                                }
                            >
                            </LoadingButton>
                            :
                            <Box sx={{ marginTop: '35px' }}>
                                {indexPostNext > 0 &&
                                    <IconButton
                                        onClick={(event) => {
                                            handleDecreseIndex(loadedPosts);
                                            handleLoadPost(event, loadedPosts[indexPostNext]._id)
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
                                {(
                                    loadedPost && loadedUser && <PostForm
                                        post={loadedPost}
                                        author={loadedUser}
                                        listComments={listComments}
                                        listReplies={listReliesComment}
                                        closeModal={closeModal}
                                    />
                                )}

                                {loadedPosts.length > 1 && indexPostNext < loadedPosts.length - 1 &&
                                    <IconButton
                                        onClick={(event) => {
                                            handleIncreseIndex(loadedPosts);
                                            handleLoadPost(event, loadedPosts[indexPostNext]._id)
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
                        }
                    </Modal>

                    <ImageList cols={2} sx={{ width: '620px', height: '100%', marginTop: '50px' }}>
                        {loadedPosts.map((post, index) => (
                            <ListItemButton
                                sx={{
                                    width: '300px', height: '300px', padding: '0px', background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                                }}
                                onClick={(event) => {
                                    openModal(index)
                                    handleLoadPost(event, post._id)
                                }}

                            >
                                {post.type === 'video' ?
                                    <video
                                        src={`${post.url[0] + '#t=5'}?w=248&fit=crop&auto=format`}
                                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    /> :
                                    <img
                                        srcSet={`${post.url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${post.url[0]}?w=248&fit=crop&auto=format`}
                                        loading="lazy"
                                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                                    />

                                }
                                <ImageListItemBar key={post.type}
                                    sx={{
                                        background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    }}
                                    position="top"
                                    actionIcon={
                                        post.type === 'video' ? (
                                            <SlideshowIcon sx={{ color: 'white', marginTop: '10px', marginRight: '10px' }} />
                                        ) : (post.type === 'image' && post.url.length > 1 ? (
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
                        {loadedUsers?.map((item, index) => (
                            <ListItem>
                                <IconButton
                                    sx={{ width: '40px', height: '40px' }}
                                    href={`/profile/${item?.username}`}
                                >
                                    <Avatar src={item?.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px' }} />
                                </IconButton>
                                <ListItemText
                                    sx={{ width: '150px' }}
                                    style={{ display: 'block' }}
                                    primary={
                                        <Link to={`/profile/${item?.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {item?.username}
                                        </Link>
                                    }
                                    secondary={`${item?.fullname}`}
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


                </Box>
            }
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