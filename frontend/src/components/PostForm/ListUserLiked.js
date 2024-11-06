import React, { useContext, useState } from 'react';
import avatar from '../../assets/user.png';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

// Material UI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';

// Material UI icon
import ClearIcon from '@mui/icons-material/Clear';

export default function ListUserLiked({ listUser, closeModal }) {
    const auth = useContext(AuthContext);

    const navigate = useNavigate();

    const [followed, setFollowed] = useState(false);

    return (
        <Box
            sx={{
                width: '350px', bgcolor: 'background.paper', borderRadius: '15px'
            }}>
            <Box sx={{
                width: '350px', bgcolor: 'background.paper', height: '60px', borderBottom: 1, borderBottomColor: '#737373',
                display: 'flex', flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: '15px', borderTopRightRadius: '15px'
            }}>
                <IconButton
                    onClick={() => {
                        closeModal();
                    }}
                    sx={{ position: 'absolute', left: '60%', transform: 'translateX(-50%)', }}
                >
                    <ClearIcon
                        sx={{ color: 'black', fontSize: 25 }}
                    />
                </IconButton>
                <span style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)', }}>
                    Lượt thích
                </span>


            </Box>
            <List
                sx={{
                    width: '350px', height: `fit-content`, maxHeight: '300px',
                    display: 'flex', flexDirection: 'column', overflow: 'auto', 

                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',

                }}>
                {listUser.map((item) => (
                    <Box>
                        <ListItem>
                            <IconButton
                                sx={{ width: '40px', height: '40px' }}
                                onClick={() => { navigate(`/profile/${item.username}`) }}
                            >
                                <Avatar src={item.avatar || avatar} sx={{ color: '#000', width: '40px', height: '40px', marginLeft: '10px' }} />
                            </IconButton>
                            <Box
                                sx={{
                                    display: "flex", alignItems: "center",
                                    flexDirection: 'row'
                                }}>
                                <ListItemText
                                    style={{ display: 'block' }}
                                    primary={
                                        <Link to={`/profile/${item.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {item.username}
                                        </Link>
                                    }
                                    secondary={item.fullname}
                                    primaryTypographyProps={{ style: { fontSize: 14, textAlign: 'center', fontWeight: 'bold' } }}
                                    sx={{ width: 'fit-content' }}
                                />
                                {item.id !== auth.userId &&
                                    <Box
                                        onClick={() => setFollowed(!followed)}
                                        sx={{
                                            marginLeft: '80px',
                                            backgroundColor: followed ? '#EFEFEF' : '#0095F6', // Initial text color
                                            cursor: 'pointer',
                                            height: '30px', width: '100px',
                                            display: "flex", alignItems: "center", justifyContent: 'center',
                                            borderRadius: 3
                                        }}
                                    >
                                        <span style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: followed ? 'black' : 'white' }}>
                                            {followed ? 'Đã theo dõi' : 'Theo dõi'}
                                        </span>
                                    </Box>
                                }
                            </Box>
                        </ListItem>
                    </Box>

                ))}
            </List>
        </Box>

    );
}
