import React, { useState, useRef, useContext } from 'react';
import FinishCreate from './FinishCreate';
import avatar from '../../assets/user.png';
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';

// Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ImageListItem } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import { TextField, Divider, Collapse, ListItemButton, ListItemText, } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

// Material UI icon
import ClearIcon from '@mui/icons-material/Clear';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

function splitDescriptionAndHashtags(input) {
    const parts = input.split(' ');

    // Phần mô tả là các từ không bắt đầu bằng '#'
    const des = parts;

    // Phần hashtags là các từ bắt đầu bằng '#'
    const hashtags = parts.filter(word => word.startsWith('#'));

    // Trả về 2 giá trị
    return { des, hashtags };
}

const tagSuggestions = [
    '#love', '#instagood', '#photooftheday', '#fashion', '#beautiful',
    '#happy', '#cute', '#tbt', '#followme', '#picoftheday',
    '#instadaily', '#instamood', '#igers', '#nature', '#like4like',
    '#travel', '#repost', '#style', '#summer', '#art',
    '#photography', '#instapic', '#friends', '#fun', '#food',
    '#fitness', '#family', '#music', '#life', '#motivation',
    '#inspiration', '#followforfollow', '#makeup', '#model', '#dog',
    '#cat', '#beauty', '#happybirthday', '#blackandwhite',
    '#selfie', '#sun', '#sky', '#smile', '#photographer',
    '#landscape', '#fashionblogger', '#vintage', '#wedding', '#naturelovers',
    '#colors', '#happyplace', '#adventure', '#outdoors', '#styleinspo',
    '#lifestyle', '#foodie', '#sea', '#beach', '#swimming',
    '#loveit', '#travelphotography', '#streetphotography', '#city', '#urban',
    '#party', '#summerfun', '#weekend', '#goodvibes', '#explore',
    '#wanderlust', '#adventuretime', '#chill', '#photogram', '#capture',
    '#instacool', '#bestoftheday', '#amazing', '#instafood', '#cooking',
    '#yummy', '#delicious', '#vegan', '#breakfast', '#dinner',
    '#lunch', '#dessert', '#foodphotography', '#healthy', '#foodstagram',
    '#snack', '#sweet', '#chocolate', '#tasty', '#fresh',
    '#garden', '#flowers', '#spring', '#autumn', '#winter',
    '#holidays', '#celebrate', '#familytime', '#home', '#interior',
    '#decor', '#inspo', '#design', '#artwork', '#draw',
    '#sketch', '#illustration', '#artist', '#creativity', '#photo',
    '#workout', '#gym', '#exercise', '#run', '#yoga',
    '#health', '#selflove', '#mentalhealth', '#wellness', '#motivationmonday',
    '#transformationtuesday', '#humpday', '#thursdaythoughts', '#fridayfeeling',
    '#saturdaynight', '#sundayfunday', '#funny', '#memes', '#comedy',
    '#quotes', '#wisdom', '#positivity', '#mindfulness', '#mindset',
    '#happiness', '#success', '#goals', '#dreams', '#inspirationdaily',
    '#empowerment', '#women', '#mensfashion', '#womensfashion', '#fashionstyle',
    '#ootd', '#fashionista', '#streetstyle', '#trendy', '#gorgeous',
    '#swag', '#lovequotes', '#relationshipgoals', '#friendship', '#bond',
    '#childhood', '#pets', '#kitten', '#puppy', '#animal',
    '#wildlife', '#naturephotography', '#landscapelovers', '#travelblogger', '#roadtrip',
    '#exploring', '#discover', '#vacation', '#wanderer', '#backpacking',
    '#local', '#culture', '#history', '#heritage', '#artgallery',
    '#museums', '#exhibitions', '#theatre', '#concert', '#musicfestival',
    '#performingarts', '#live', '#band', '#singer', '#musician',
    '#instamusic', '#guitar', '#piano', '#drums', '#bandlife',
    '#tour', '#newmusic', '#album', '#rock', '#pop',
    '#jazz', '#classical', '#hiphop', '#rap', '#musiclover'
];


export default function UploadContent({ closeModal }) {
    const auth = useContext(AuthContext);
    // Replace with your own cloud name
    const [cloudName] = useState("dbmynlh3f");

    const [uploadPreset] = useState("iezes36w");

    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [fileType, setFileType] = useState('');
    const [fileUrls, setFileUrls] = useState([]);
    const [active, setActive] = useState(false);
    const [itemDisplay, setItemDisplay] = useState(null);
    const [isSetContent, setChangeSetContent] = useState(false);
    const [isFinishCreate, setChangeFinishCreate] = useState(false);

    const handleButtonClick = () => {
        if (fileType !== 'video') {
            fileInputRef.current.click(); // Kích hoạt chọn file
        } else {
            alert('Bạn đã chọn video, không thể chọn thêm file.');
        }
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        const firstFile = newFiles[0];

        if (firstFile) {
            const selectedFileType = firstFile.type.startsWith('image') ? 'image' : 'video';

            if (fileType === '' || (fileType === 'image' && selectedFileType === 'image')) {
                // Cho phép thêm nhiều ảnh nếu chưa chọn file hoặc chỉ chọn ảnh
                const updatedFiles = [...files, ...newFiles];
                setFiles(updatedFiles);
                setFileType(selectedFileType);

                // Tạo URL từ các file và lưu chúng vào state
                const newUrls = newFiles.map(file => URL.createObjectURL(file));
                setFileUrls(prevUrls => [...prevUrls, ...newUrls]);

            } else if (selectedFileType === 'video' && files.length === 0) {
                // Nếu chọn video và chưa chọn file nào trước đó
                setFiles([firstFile]);
                setFileType('video');

                const videoUrl = URL.createObjectURL(firstFile);
                setFileUrls([videoUrl]);

            } else {
                alert('Chỉ có thể chọn một video hoặc nhiều ảnh.');
            }
        }
    };

    const handleRemoveAllFile = () => {
        setFiles([]);
        setFileType('');
        setFileUrls([]);
    }

    const handleRemoveFile = (index) => {
        const updatedFileUrls = fileUrls.filter((_, i) => i !== index);
        const updatedFiles = files.filter((_, i) => i !== index);


        setFileUrls(updatedFileUrls);
        setFiles(updatedFiles);

        if (fileUrls.length <= 0) {
            handleRemoveAllFile();
            setItemDisplay(null);
        }
    };

    // set content
    let item;
    if (fileUrls.length > 0) {
        item = fileUrls
    }

    let [index, setIndexImage] = useState(0);

    const handleIndexImageIncrease = () => {
        index++;
        if (index < item.length) {
            setIndexImage(index);
        }
        if (index >= item.length) {
            setIndexImage(0);
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
    const [inputCount, setInputCount] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        const result = splitDescriptionAndHashtags(value)
        const lastestTag = result.des[inputCount]

        // Check if '#' was typed and show suggestions
        if (lastestTag.startsWith('#')) {
            const searchTerm = value.split('#').pop(); // Get the tag part after '#'
            const matchedTags = tagSuggestions.filter((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matchedTags.length > 0) {
                setFilteredTags(matchedTags);
                setShowSuggestions(true);
            }
            else if (matchedTags.length <= 0) {

                setShowSuggestions(false);
            }
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

    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            setInputCount((prevCount) => prevCount + 1);
        }
    };

    // upload post
    const [isLoading, setLoading] = useState(false);
    const [underThirteen, setUnderThirteen] = useState('no');
    const [upEighteen, setUpEighteen] = useState('no');

    const handleChangeUpEighteen = (event) => {
        setUpEighteen(event.target.value);
    };

    const handleChangeUnderThirteen = (event) => {
        setUnderThirteen(event.target.value);
    };

    const handleUpload = async () => {
        const urls = []
        setLoading(true);

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            formData.append('upload_preset', uploadPreset); // Thay bằng upload preset của bạn
            formData.append('cloud_name', cloudName); // Thay bằng cloud_name của bạn

            try {
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    formData
                );
                const url = res.data.secure_url
                urls.push(url); // Thêm URL vào mảng uploadedUrls
            } catch (err) {
                console.error(err);
            }
        }

        console.log(urls)

        if (urls.length > 0) {
            try {
                const result = splitDescriptionAndHashtags(inputValue);


                const response = await fetch('http://localhost:5000/api/posts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        caption: inputValue,
                        type: fileType,
                        url: urls,
                        author: auth.userId,
                        tags: result.hashtags,
                        underthirteen: underThirteen,
                        upeighteen: upEighteen
                    })
                });

                const responseData = await response.json();
                console.log(responseData);
                setLoading(false);
            } catch (error) {
                console.error('Error posting data', error);
            }
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setChangeFinishCreate(true)
        try {
            await handleUpload();
        }
        catch (error) {
            console.error('Error posting data', error);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*,video/*"
                onChange={handleFileChange}
                multiple={fileType === '' || fileType === 'image'} // Cho phép chọn nhiều nếu là ảnh
            />
            <IconButton
                onClick={() => {
                    { (!isLoading || files.length <= 0) && closeModal() }
                    window.location.reload();
                }}
                sx={{
                    position: 'absolute', left: '90%', marginTop: '30px',
                    transform: 'translateX(-50%)',
                }}
            >
                <ClearIcon
                    sx={{ color: 'white', fontSize: 25 }}
                />
            </IconButton>

            <Box
                position='flex'
                sx={{
                    position: 'absolute', left: '50%', marginTop: '80px',
                    transform: 'translateX(-50%)',
                }}
            >
                {isFinishCreate ?
                    <Box
                        sx={{
                            width: '500px', bgcolor: 'background.paper',
                            height: '500px', border: 1, borderRadius: 3, borderColor: 'white'
                        }}
                    >
                        <FinishCreate isLoading={isLoading} />
                    </Box>
                    :
                    <div>
                        {isSetContent ?

                            <Box
                                sx={{
                                    width: '800px', bgcolor: 'background.paper',
                                    height: '500px', border: 1, borderRadius: 3, borderColor: 'white'
                                }}
                            >
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box
                                            sx={{
                                                width: '800px', height: '50px', display: 'flex',
                                                justifyContent: 'space-between', alignItems: 'center',
                                                padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB'
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => {
                                                    setChangeSetContent(false)
                                                    setInputCount(0)
                                                    setInputValue('')
                                                }}
                                                sx={{
                                                    height: '25px', width: '25px', marginLeft: '20px'
                                                }}
                                            >
                                                <KeyboardBackspaceIcon sx={{ fontSize: 25, color: 'black' }} />
                                            </IconButton>
                                            <form onSubmit={handleSubmit}>
                                                <button
                                                    type='submit'
                                                    style={{
                                                        fontSize: 15, fontWeight: 'normal',
                                                        marginRight: '20px', color: '#0095F6',
                                                        cursor: 'pointer',
                                                        background: 'none',
                                                        border: 'none',
                                                    }}
                                                >
                                                    Chia sẻ
                                                </button>
                                            </form>

                                        </Box>
                                        <div>
                                            <Box sx={{ width: '800px', height: '449px', justifyContent: 'space-between' }} >
                                                <Box display="flex" sx={{ width: '800px', height: '449px', justifyContent: 'space-between' }}>
                                                    {files[0].type.startsWith('video') ?
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
                                                            onKeyDown={handleKeyDown}
                                                            style={{
                                                                height: '300px',
                                                                overflow: 'auto',
                                                                textAlign: 'start',
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
                                                                            value={underThirteen}
                                                                            onChange={handleChangeUnderThirteen}
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
                                                                {underThirteen === 'no' &&
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
                                                                                value={upEighteen}
                                                                                onChange={handleChangeUpEighteen}
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
                                                                }
                                                            </Collapse>
                                                        </div>
                                                    </Box>
                                                </Box>

                                            </Box>
                                        </div>

                                    </Box>
                                </Box>

                            </Box>
                            :
                            <Box
                                sx={{
                                    width: '500px', bgcolor: 'background.paper',
                                    height: '500px', border: 1, borderRadius: 3, borderColor: 'white'
                                }}
                            >
                                {fileUrls.length > 0 ?
                                    (
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Box
                                                    sx={{
                                                        width: '500px', height: '50px', display: 'flex',
                                                        justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB'
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={() => {
                                                            handleRemoveAllFile()
                                                        }}
                                                        sx={{
                                                            height: '25px', width: '25px', marginLeft: '20px'
                                                        }}
                                                    >
                                                        <KeyboardBackspaceIcon sx={{ fontSize: 25, color: 'black' }} />
                                                    </IconButton>

                                                    <span
                                                        onClick={() => { setChangeSetContent(true) }}
                                                        style={{
                                                            fontSize: 15, fontWeight: 'normal',
                                                            marginRight: '20px', color: '#0095F6',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Tiếp
                                                    </span>
                                                </Box>
                                                <Box display="flex" alignItems="center" justifyContent="center">

                                                    {files[0].type.startsWith('image') ? (
                                                        <div>
                                                            <img
                                                                src={itemDisplay || fileUrls[0]}
                                                                style={{
                                                                    width: '500px', height: '449px', objectFit: 'cover', zIndex: 1,
                                                                    borderBottomLeftRadius: '12px',
                                                                    borderBottomRightRadius: '12px',
                                                                }}
                                                            />
                                                            <IconButton
                                                                onClick={() => {
                                                                    setActive(!active)
                                                                }}
                                                                sx={{
                                                                    position: 'absolute', bottom: '3%', left: '5%',
                                                                    transform: 'translateX(-50%)',
                                                                    backgroundColor: active ? '#f5f5f5' : '#333',  // Dark gray/charcoal color similar to Instagram's style
                                                                }}
                                                            >
                                                                <FilterNoneIcon sx={{ color: 'white', fontSize: 15, zIndex: 1000, }} />
                                                            </IconButton>
                                                            {active &&
                                                                <Box sx={{
                                                                    width: '500px', height: '100px',
                                                                    position: 'absolute', bottom: '10%', left: '50%',
                                                                    transform: 'translateX(-50%)',
                                                                }}>
                                                                    <Box
                                                                        sx={{
                                                                            width: 'fit-content', maxWidth: '400px', height: '100px',
                                                                            padding: '0px', backgroundColor: 'rgba(51, 51, 51, 0.7)',
                                                                            borderRadius: '15px', overflow: 'auto',
                                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                handleButtonClick()
                                                                            }}
                                                                            sx={{
                                                                                width: '30px', height: '30px',
                                                                                marginTop: '10px',
                                                                                backgroundColor: '#333',
                                                                                marginLeft: '10px',
                                                                                marginRight: '10px'
                                                                            }}
                                                                        >
                                                                            <AddIcon sx={{ color: 'white', fontSize: 30, zIndex: 1000, }} />
                                                                        </IconButton>
                                                                        <Box
                                                                            sx={{
                                                                                width: 'fit-content', maxWidth: '300px', height: '100px',
                                                                                padding: '0px',
                                                                                borderRadius: '15px', overflow: 'auto',
                                                                                marginRight: '10px',
                                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                                '&::-webkit-scrollbar': {
                                                                                    display: 'none',
                                                                                },
                                                                                '-ms-overflow-style': 'none',
                                                                                'scrollbar-width': 'none',
                                                                            }}
                                                                        >

                                                                            <ImageList cols={fileUrls.length} sx={{ width: '100%', height: '80px' }}>
                                                                                {fileUrls.map((url, index) => (
                                                                                    <div key={index}>
                                                                                        <ImageListItem
                                                                                            sx={{
                                                                                                width: '80px', height: '80px', padding: '0px', background: 'rgba(0, 0, 0, 0)'
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                onClick={() => {
                                                                                                    setItemDisplay(url)

                                                                                                }}
                                                                                                src={url} alt={`Hình ảnh ${index + 1}`}
                                                                                                style={{
                                                                                                    width: '80px', height: '80px', objectFit: 'cover', zIndex: 1
                                                                                                }}
                                                                                            />
                                                                                            <ImageListItemBar
                                                                                                sx={{
                                                                                                    zIndex: 100, background: 'rgba(0, 0, 0, 0)'
                                                                                                }}
                                                                                                position="top"
                                                                                                actionIcon={
                                                                                                    <IconButton
                                                                                                        onClick={() => {
                                                                                                            handleRemoveFile(index)
                                                                                                        }}
                                                                                                        sx={{
                                                                                                            width: '18px', height: '18px',
                                                                                                            marginTop: '3px',
                                                                                                            backgroundColor: 'rgba(51, 51, 51, 0.5)',
                                                                                                            marginRight: '3px',
                                                                                                            zIndex: 1000,
                                                                                                        }}
                                                                                                    >
                                                                                                        <ClearIcon sx={{ color: 'white', fontSize: 15 }} />
                                                                                                    </IconButton>

                                                                                                }
                                                                                                actionPosition="right"
                                                                                            />

                                                                                        </ImageListItem>

                                                                                    </div>
                                                                                ))}
                                                                            </ImageList>


                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            }
                                                        </div>
                                                    ) : (
                                                        <video controls
                                                            style={{
                                                                maxWidth: '500px', height: '449px', objectFit: 'cover',
                                                                borderBottomLeftRadius: '12px',
                                                                borderBottomRightRadius: '12px',
                                                            }}
                                                        >
                                                            <source src={fileUrls[0]} type="video/mp4" />
                                                        </video>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                    :
                                    (
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ width: '500px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB' }}>
                                                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>
                                                        Tạo bài viết mới
                                                    </span>
                                                </Box>
                                                <Box sx={{
                                                    width: '500px', height: '450px', display: 'flex',
                                                    justifyContent: 'center', alignItems: 'center',
                                                    padding: '0px', borderBottom: 1, borderBottomColor: '#DBDBDB',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '50px' }}>
                                                        <CropOriginalIcon sx={{ fontSize: 100, transform: 'rotate(-20deg)' }} />
                                                        <SmartDisplayIcon sx={{ fontSize: 100, transform: 'rotate(20deg)', marginTop: '20px' }} />
                                                    </Box>
                                                    <span style={{ fontSize: 22, fontWeight: 'lighter' }}>
                                                        Thêm ảnh và video vào đây
                                                    </span>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#0095F6', borderRadius: 2, marginTop: '20px',
                                                            height: '40px', width: '140px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            handleButtonClick()
                                                            setActive(false)
                                                        }}
                                                    >
                                                        <span style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>
                                                            Chọn từ máy tính
                                                        </span>
                                                    </Box>
                                                </Box>

                                            </Box>
                                        </Box>
                                    )
                                }

                            </Box>
                        }
                    </div>
                }

            </Box >
        </div >
    );
}

