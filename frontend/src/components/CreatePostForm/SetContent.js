import React, { useState, useRef } from 'react';
import MoreForm from '../MoreForm/MoreForm';
import avatar from '../../assets/user.png';

// Cloudinary
import { Cloudinary } from '@cloudinary/url-gen';

//// Material UI 
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Box, TextField, Divider, Collapse, ListItemButton, ListItemText, } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

// Material UI icon
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';


const SetContent = ({ postId, fileUrls, files }) => {
    let item;
    if (postId) {
        item = itemData.find((item) => item.id === postId).url;
    }
    else {
        item = fileUrls;
    }

    let [index, setIndexImage] = useState(0);

    if (index >= item.length) {
        setIndexImage(0);
    }

    const handleIndexImageIncrease = () => {
        index++;
        if (index < item.length) {
            setIndexImage(index);
        }
    }

    const handleIndexImageDecrease = () => {
        index--;
        if (index >= 0) {
            setIndexImage(index);
        }
    }

    const [isAdvanceSetting, SetAdvanceSetting] = useState(false);

    const collapseRef = useRef(null);

    const handleToggle = () => {
        SetAdvanceSetting(!isAdvanceSetting);
        if (!isAdvanceSetting) {
            // Scroll to the Collapse element
            setTimeout(() => {
                collapseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // Add a small delay to ensure the collapse starts expanding before scrolling
        }
    };

    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);

    const tagSuggestions = ['#React', '#MaterialUI', '#JavaScript', '#Flutter', '#Python', '#Python', '#Python', '#Python']; // Example tags

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        // Check if '#' was typed and show suggestions
        if (value.includes('#')) {
            const searchTerm = value.split('#').pop(); // Get the tag part after '#'
            const matchedTags = tagSuggestions.filter((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTags(matchedTags);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleTagSelection = (selectedTag) => {
        const lastIndex = inputValue.lastIndexOf('#');
        const newInput = inputValue.substring(0, lastIndex) + selectedTag;
        setInputValue(newInput);
        setShowSuggestions(false);  // Close the suggestions after selection
    };

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dbmynlh3f'
        }
    });

    const myVideo = cld.video('ruumym3pwvbqtr3q1dbj').toURL();
    return (
        <div>
            <Box sx={{ width: '800px', height: '449px', justifyContent: 'space-between' }} >
                <Box display="flex" sx={{ width: '800px', height: '449px', justifyContent: 'space-between' }}>
                    {item.type === 'video' || files[0].type.startsWith('video') ?
                        <Box border={1} borderColor="black" sx={{ width: '300px', height: '449px', padding: '0px' }} >
                            <video controls autoPlay style={{
                                width: '500px', height: '449px', objectFit: 'cover', zIndex: 1,
                                borderBottomLeftRadius: '12px',
                            }}>
                                <source src={item[0]} type='video/mp4' />
                            </video>
                        </Box>
                        :
                        <Box
                            display="flex"
                            sx={{ width: '500px', height: '449px', padding: '0px', position: 'relative', display: 'inline-block' }}
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
                                src={item[index]}
                                style={{
                                    width: '500px', height: '449px', objectFit: 'cover', zIndex: 1,
                                    borderBottomLeftRadius: '12px',
                                }}
                            />
                            {item.length > 1 &&
                                <Box
                                    sx={{
                                        position: 'absolute', bottom: '1%', left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <List>
                                        {Array.from({ length: item.length }, (_, i) => (
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
                            {(item.length > 1 && index < item.length - 1) &&
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
                    <Box
                        sx={{
                            backgroundColor: 'white', width: '300px', height: '449px',
                            borderBottomRightRadius: '12px', display: 'flex', flexDirection: 'column',
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                display: 'none',  // Hide scrollbar on Chrome/Safari
                            },
                            '-ms-overflow-style': 'none',  // Hide scrollbar on IE/Edge
                            'scrollbar-width': 'none',  // Hide scrollbar on Firefox
                        }}
                    >
                        <Box sx={{
                            display: 'flex', flexDirection: 'row', alignItems: 'center',
                            width: '299px', height: '50px', marginLeft: '10px'
                        }}>
                            <Avatar src={avatar} sx={{ color: '#000', width: '30px', height: '30px', }} />
                            <span style={{ fontSize: 13, fontWeight: 'bold', marginLeft: '10px' }}>wasabi1234</span>
                        </Box>
                        <TextField
                            fullWidth
                            variant="outlined"
                            multiline
                            maxRows={12}
                            value={inputValue}
                            onChange={handleInputChange}
                            autoFocus={true}
                            inputProps={{
                                style: {
                                    height: '300px',
                                    overflow: 'auto',
                                    textAlign: 'start', // Align text at the top
                                },
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none', // Hide border of TextField
                                        },
                                        '&::-webkit-scrollbar': {
                                            display: 'none', // Hide scrollbar on Chrome/Safari
                                        },
                                        '-ms-overflow-style': 'none', // Hide scrollbar on IE/Edge
                                        'scrollbar-width': 'none', // Hide scrollbar on Firefox
                                    },
                                },
                            }}
                        />

                        {showSuggestions && (
                            <Box sx={{
                                width: '300px', height: '250px', zIndex: 9999,
                                position: 'absolute', top: '30%', overflow: 'auto'
                            }}>
                                <List
                                    sx={{
                                        position: 'absolute',
                                        top: 0, // Adjust top position to ensure dropdown shows under the TextField
                                        width: '100%',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        zIndex: 9999,
                                        overflow: 'auto'
                                    }}
                                >
                                    {filteredTags.map((tag, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton onClick={() => handleTagSelection(tag)}>
                                                <ListItemText primary={tag} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                        <Divider />
                        <Box sx={{
                            display: 'flex', flexDirection: 'row', alignItems: 'center',
                            width: '299px', height: '90px', marginLeft: '10px', justifyContent: 'space-between'
                        }}>
                            <span style={{ fontSize: 16, fontWeight: isAdvanceSetting ? 'bold' : 'normal', marginLeft: '10px' }}>Cài đặt nâng cao</span>
                            <IconButton
                                onClick={() => { handleToggle() }}
                                sx={{ marginRight: '20px' }}
                            >
                                {isAdvanceSetting ? <ArrowDropUpIcon sx={{ fontSize: 20, color: 'black' }} /> : <ArrowDropDownIcon sx={{ fontSize: 20, color: 'black' }} />}
                            </IconButton>
                        </Box>
                        <div ref={collapseRef}>
                            <Collapse in={isAdvanceSetting} timeout="auto" unmountOnExit>
                                <Box
                                    sx={{
                                        width: '299px', height: 'fit-content',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginTop: '10px',
                                        backgroundColor: 'transparent',
                                        marginLeft: '20px'
                                    }}

                                >
                                    <span style={{ fontSize: 16, fontWeight: 'normal', marginBottom: '20px' }}>
                                        Đối tượng người xem
                                    </span>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                            defaultValue={'no'}
                                        >
                                            <FormControlLabel label="Có, nội dung này dành cho trẻ em" control={
                                                <Radio
                                                    sx={{
                                                        color: '#000',
                                                        '&.Mui-checked': {
                                                            color: '#000',
                                                        },
                                                    }}
                                                />}
                                                value="yes" sx={{ marginBottom: '10px', width: '280px' }} />
                                            <FormControlLabel label="Không, nội dung này không dành cho trẻ em"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#000',
                                                            '&.Mui-checked': {
                                                                color: '#000',
                                                            },
                                                        }}
                                                    />}
                                                value="no" sx={{ marginBottom: '10px', width: '280px' }} />
                                        </RadioGroup>
                                    </FormControl>
                                    <Divider />
                                </Box>
                                <Box
                                    sx={{
                                        width: '299px', height: 'fit-content',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginTop: '10px',
                                        backgroundColor: 'transparent',
                                        marginLeft: '20px'
                                    }}

                                >
                                    <span style={{ fontSize: 16, fontWeight: 'normal', marginBottom: '20px' }}>
                                        Giới hạn độ tuổi
                                    </span>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                            defaultValue={'no'}

                                        >
                                            <FormControlLabel label="Có, giới hạn video của tôi ở những người xem trên 18 tuổi"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#000',
                                                            '&.Mui-checked': {
                                                                color: '#000',
                                                            },
                                                        }}
                                                    />}
                                                value="yes" sx={{ marginBottom: '10px', width: '280px' }} />
                                            <FormControlLabel label="Không, không giới hạn video của tôi ở những người xem trên 18 tuổi"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            color: '#000',
                                                            '&.Mui-checked': {
                                                                color: '#000',
                                                            },
                                                        }}
                                                    />}
                                                value="no" sx={{ marginBottom: '10px', width: '280px' }} />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Collapse>
                        </div>
                    </Box>
                </Box>

            </Box>
        </div>
    );
}
export default SetContent;

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