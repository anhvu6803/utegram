import React, { useContext, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import avatar from '../../assets/user.png';

// Material UI
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { TextField, Collapse, ListItemText, } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';


// Material UI icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

export default function SelectedListItem({ closeModal, author, type, itemId, user, commentId, post }) {
    const auth = useContext(AuthContext);

    const { timeLoading, error, sendRequest, clearError } = useHttpClient();

    const tagSuggestions = auth.tags;
    const [isReport, setReport] = useState(false);
    const [isSuccessReport, setSuccessReport] = useState(false);
    const [isConfirmDelete, setConfirmDelete] = useState(false);

    const navigate = useNavigate();

    const handleBodyClick = (item) => {
        if (item === 'Đi đến bài viết') {
            navigate(`/post/${itemId}`);
            window.location.reload();
        }
        else if (item === 'Chỉnh sửa') {
            setChangeSetContent(!isSetContent);
        }
        else if (item === 'Cài đặt') {
            navigate(`/accounts/edit`);
        }
        else if (item === 'Đăng xuất') {
            auth.logout();
        }
    };

    const handleTopClick = (event, item) => {
        if (item === 'Báo cáo') {
            setReport(!isReport);
        }
        else if (item === 'Chặn') {

        }
        else if (item === 'Xóa') {
            setConfirmDelete(!isConfirmDelete);
        }
    }

    const handleReport = async (event, item) => {
        event.preventDefault();
        setSuccessReport(!isSuccessReport);
        try {
            if (type === 'post') {
                await sendRequest(
                    `http://localhost:5000/api/report/post`,
                    'POST',
                    JSON.stringify({
                        senderId: auth.userId,
                        postId: itemId,
                        reason: item
                    }),
                    { 'Content-Type': 'application/json' }
                );
            }
            else if (type === 'comment' || type === 'reply') {
                await sendRequest(
                    `http://localhost:5000/api/report/comment`,
                    'POST',
                    JSON.stringify({
                        senderId: auth.userId,
                        commentId: itemId,
                        reason: item
                    }),
                    { 'Content-Type': 'application/json' }
                );
            }
            else if (type === 'user') {
                await sendRequest(
                    `http://localhost:5000/api/report/user`,
                    'POST',
                    JSON.stringify({
                        senderId: auth.userId,
                        userId: itemId,
                        reason: item
                    }),
                    { 'Content-Type': 'application/json' }
                );
            }

        } catch (err) {

        }
    }
    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            if (type === 'comment') {
                await sendRequest(
                    `http://localhost:5000/api/comment/comment/${itemId}`,
                    'DELETE',
                );
            }
            else if (type === 'reply') {
                await sendRequest(
                    `http://localhost:5000/api/comment/reply/${itemId}`,
                    'DELETE',
                    JSON.stringify({ commentId: commentId }),
                    { 'Content-Type': 'application/json' }
                );
            }
            else if (type === 'post') {
                for (let i = 0; i < post?.comments?.length; i++) {
                    try {
                        await sendRequest(
                            `http://localhost:5000/api/report/comment/${post?.comments[i]}`,
                            'DELETE',
                        );
                    } catch (err) { }

                    try {
                        await sendRequest(
                            `http://localhost:5000/api/comment/comment/${post?.comments[i]}`,
                            'DELETE',
                        );
                    } catch (err) { }
                }
                try {
                    await sendRequest(
                        `http://localhost:5000/api/notify/post/${itemId}`,
                        'DELETE'
                    );
                } catch (err) { }

                try {
                    await sendRequest(
                        `http://localhost:5000/api/posts/${itemId}`,
                        'DELETE'
                    );
                } catch (err) { }
                navigate(`/profile/${author.username}`);
            }
            window.location.reload();
        } catch (err) {

        }

    }
    let data, report, typeChange;

    if (type === 'post') {
        data = author._id === auth.userId ? optionItem[0].content[1] : optionItem[0].content[0]
        report = reportData[0].reportPost;
        typeChange = 'bài viết';
    }
    else if (type === 'comment' || type === 'reply') {
        data = author._id === auth.userId ? optionItem[1].content[1] : optionItem[1].content[0]
        report = reportData[1].reportComment;
        typeChange = 'bình luận';
    }
    else if (type === 'user') {
        data = author._id === auth.userId ? optionItem[2].content[1] : optionItem[2].content[0]
        report = reportData[2].reportUser;
        typeChange = 'người dùng'
    }

    const [isAdvanceSetting, SetAdvanceSetting] = useState(false);
    const [underThirteen, setUnderThirteen] = useState('no');
    const [upEighteen, setUpEighteen] = useState('no');
    const [inputValue, setInputValue] = useState(post?.caption);
    const [inputCount, setInputCount] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);
    const [isSetContent, setChangeSetContent] = useState(false);

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

    const handleChangeUpEighteen = (event) => {
        setUpEighteen(event.target.value);
    };

    const handleChangeUnderThirteen = (event) => {
        setUnderThirteen(event.target.value);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const result = splitDescriptionAndHashtags(inputValue);
            
            await sendRequest(
                `http://localhost:5000/api/posts/${post._id}`,
                'PATCH',
                JSON.stringify({
                    caption: inputValue,
                    tags: result.hashtags,
                    underthirteen: underThirteen,
                    upeighteen: upEighteen
                }),
                { 'Content-Type': 'application/json' }
            );

            await fetch('http://localhost:5000/api/tag', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tags: result.hashtags,
                })
            });
            closeModal();
            setChangeSetContent(false);
            setInputCount(0);
            setInputValue('');
            window.location.reload();
        } catch (err) {

        }
    }

    let item;
    if (post?.url.length > 0) {
        item = post.url;
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

    const handleInputChange = (event) => {
        const value = event.target.value;

        if (value.length <= 2200) {
            setInputValue(value);
        }

        const result = splitDescriptionAndHashtags(value)

        const inputCount = result.des.length;
        let lastestTag;
        if (inputCount > 0) {
            lastestTag = result.des[inputCount - 1]
        }
        console.log(result.des)
        // Check if '#' was typed and show suggestions
        if (lastestTag.startsWith('#')) {
            console.log(lastestTag)
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

    return (
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
                                <span
                                    onClick={() => {
                                        setChangeSetContent(false)
                                        setInputCount(0)
                                        setInputValue('')
                                    }}
                                    style={{
                                        fontSize: 15, marginLeft: '20px', cursor: 'pointer'
                                    }}
                                >
                                    Hủy
                                </span>

                                <span
                                    onClick={(e) => { handleUpdate(e) }}
                                    style={{
                                        fontSize: 15, fontWeight: 'normal',
                                        marginRight: '20px', color: '#0095F6',
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                    }}
                                >
                                    Chỉnh sửa
                                </span>
                            </Box>
                            <div>
                                <Box sx={{ width: '800px', height: '449px', justifyContent: 'space-between' }} >
                                    <Box display="flex" sx={{ width: '800px', height: '449px', justifyContent: 'space-between' }}>
                                        {post.type === 'video' ?
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
                                            <Box sx={{
                                                display: 'flex', flexDirection: 'column',
                                                width: '299px',
                                            }}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    multiline
                                                    maxRows={12}
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    autoFocus={true}
                                                    style={{
                                                        height: '300px',
                                                        textAlign: 'start',
                                                        '&::-webkit-scrollbar': {
                                                            display: 'none', // Hide scrollbar on Chrome/Safari
                                                        },
                                                        '-ms-overflow-style': 'none', // Hide scrollbar on IE/Edge
                                                        'scrollbar-width': 'none', // Hide scrollbar on Firefox
                                                    }}

                                                    slotProps={{
                                                        input: {
                                                            maxLength: 2200,
                                                            sx: {
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    border: 'none', // Hide border of TextField
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                                <span style={{
                                                    textAlign: 'right', marginRight: '20px', color: '#c7c7c7', fontSize: 13,
                                                    marginBottom: '10px'
                                                }}>
                                                    {`${inputValue.length} / 2200`}
                                                </span>
                                            </Box>

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
                                            {auth?.age > 13 &&
                                                <div>
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
                                                            {underThirteen === 'no' && auth.age >= 18 &&
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
                                                </div>
                                            }
                                        </Box>
                                    </Box>

                                </Box>
                            </div>

                        </Box>
                    </Box>

                </Box>
                :
                <div>
                    {isConfirmDelete ?
                        <Box sx={{
                            width: '450px', bgcolor: 'background.paper',
                            marginTop: '100px', border: 1, borderColor: '#777777', borderRadius: 3,
                            flexDirection: 'column'
                        }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                marginTop: '30px'
                            }}>
                                <span
                                    style={{
                                        fontSize: 18, fontWeight: 'bold',
                                        width: '380px', textAlign: 'center',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {`Xóa ${typeChange}`}
                                </span>
                                <span
                                    style={{
                                        fontSize: 15,
                                        width: '380px', textAlign: 'center',
                                        marginBottom: '20px'
                                    }}
                                >
                                    {`Bạn có chắc chắn muốn xóa ${typeChange} này không?`}
                                </span>
                            </Box>
                            <Divider />
                            <ListItemButton
                                onClick={(event) => {
                                    handleDelete(event)
                                }}
                                sx={{ width: '450px', height: '48px', justifyContent: 'center', color: '#ED4956' }}
                            >
                                <span>Xóa</span>
                            </ListItemButton>
                            <Divider />
                            <ListItemButton
                                onClick={() => {
                                    setConfirmDelete(!isConfirmDelete)
                                }}
                                sx={{ width: '450px', height: '48px', justifyContent: 'center' }}
                            >
                                <span>Hủy</span>
                            </ListItemButton>
                        </Box>
                        :
                        <div>
                            {isSuccessReport ?
                                <Box
                                    sx={{
                                        width: '450px', height: '500px', bgcolor: 'background.paper', marginTop: '100px',
                                        border: 1, borderColor: '#777777', borderRadius: 3,
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        marginTop: '50px'
                                    }}>
                                        <CheckCircleOutlineIcon sx={{ fontSize: 110, color: '#f09433' }} />
                                        <span
                                            style={{
                                                fontSize: 18, fontWeight: 'bold', marginTop: '20px',
                                                width: '380px', textAlign: 'center',

                                            }}
                                        >
                                            Cảm ơn bạn đã đóng góp ý kiến
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 17, fontWeight: 'normal', marginTop: '20px',
                                                width: '380px', textAlign: 'center'

                                            }}
                                        >
                                            Khi nhìn thấy nội dung mình không thích trên Utegram, bạn có thể báo cáo nếu nội dung đó không tuân thủ Nguyên tắc cộng đồng hoặc xóa người đã chia sẻ nội dung đó khỏi trải nghiệm của mình.
                                        </span>

                                        <ListItemButton
                                            onClick={() => {
                                                closeModal()
                                            }}
                                            sx={{
                                                width: '400px', height: '40px',
                                                justifyContent: 'center', marginTop: '50px',
                                                backgroundColor: '#0095F6', color: 'white',
                                                borderRadius: '15px', fontWeight: 'bold'
                                            }}
                                        >
                                            <span>Đóng</span>
                                        </ListItemButton>

                                    </Box>
                                </Box>

                                :
                                <div>
                                    {isReport ?
                                        <Box
                                            sx={{
                                                width: '450px', bgcolor: 'background.paper', marginTop: '100px',
                                                border: 1, borderColor: '#777777', borderRadius: 3,
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '450px', height: '48px', display: 'flex',
                                                    justifyContent: 'center', alignItems: 'center'
                                                }}
                                            >
                                                <span style={{ fontWeight: 'bold', color: 'black' }}>Báo cáo</span>
                                            </Box>
                                            <Divider />

                                            <Box
                                                sx={{
                                                    width: '450px', height: '48px', display: 'flex',
                                                    justifyContent: 'left', alignItems: 'center',
                                                    marginLeft: '15px'
                                                }}
                                            >
                                                <span style={{ fontWeight: 'bold', color: 'black' }}>{`Tại sao lại báo cáo ${typeChange} này!`}</span>
                                            </Box>

                                            <List sx={{ padding: 0 }}>
                                                {report.map((item) => (
                                                    <ListItem sx={{ width: '450px', height: '48px', padding: 0 }}>
                                                        <ListItemButton
                                                            onClick={(event) => handleReport(event, item)}
                                                            sx={{ width: '450px', height: '48px', justifyContent: 'left' }}
                                                        >
                                                            <span>{item}</span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>

                                            <ListItemButton
                                                onClick={() => {
                                                    setReport(!isReport);
                                                }}
                                                sx={{ width: '450px', height: '48px', justifyContent: 'left' }}
                                            >
                                                <span style={{ fontWeight: 'bold', color: 'black' }}>Hủy</span>
                                            </ListItemButton>
                                        </Box>
                                        :
                                        <Box sx={{ width: '450px', bgcolor: 'background.paper', marginTop: '100px', border: 1, borderColor: '#777777', borderRadius: 3 }}>
                                            <List sx={{ padding: 0 }}>
                                                {data.top.map((item) => (
                                                    <ListItem sx={{ width: '450px', height: '48px', padding: 0 }}>
                                                        <ListItemButton
                                                            onClick={(event) => handleTopClick(event, item)}
                                                            sx={{ width: '450px', height: '48px', justifyContent: 'center' }}
                                                        >
                                                            <span style={{ color: '#ED4956', fontWeight: 'bold' }}>{item}</span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <List sx={{ padding: 0 }}>
                                                {data.body.map((item) => (
                                                    <ListItem sx={{ width: '450px', height: '48px', padding: 0 }}>
                                                        <ListItemButton
                                                            onClick={() => handleBodyClick(item)}
                                                            sx={{ width: '450px', height: '48px', justifyContent: 'center' }}
                                                        >
                                                            <span>{item}</span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <ListItemButton
                                                onClick={() => {
                                                    closeModal()
                                                }}
                                                sx={{ width: '450px', height: '48px', justifyContent: 'center' }}
                                            >
                                                <span>Hủy</span>
                                            </ListItemButton>
                                        </Box>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    );
}

const optionItem = [
    {
        content: [
            {
                top: ['Báo cáo'],
                body: ['Đi đến bài viết'],
            },
            {
                top: ['Xóa'],
                body: ['Chỉnh sửa', 'Đi đến bài viết'],
            }
        ]
    },
    {
        content: [
            {
                top: ['Báo cáo'],
                body: [],
            },
            {
                top: ['Xóa'],
                body: [],
            }
        ]
    },
    {
        content: [
            {
                top: ['Báo cáo', 'Chặn'],
                body: [],
            },
            {
                top: [],
                body: ['Cài đặt', 'Đăng xuất'],
            }
        ]
    }
]

const reportData = [
    {
        reportPost: [
            'Chỉ là tôi không thích bài viết này',
            'Bắt nạt hoặc liên hệ theo cách không mong muốn',
            'Tự tử, tự gây thương tích hoặc chứng rối loạn ăn uống',
            'Bạo lực, thù ghét hoặc bóc lột',
            'Bán hoặc quảng cáo mặt hàng bị hạn chế',
            'Ảnh khỏa thân hoặc hoạt động tình dục',
            'Lừa đảo, gian lận hoặc spam',
            'Thông tin sai sự thật'
        ]
    },
    {
        reportComment: [
            'Đây là spam',
            'Ảnh khỏa thân hoặc hoạt động tình dục',
            'Biểu tượng hoặc ngôn từ gây thù ghét',
            'Bạo lực hoặc tổ chức nguy hiểm',
            'Bán hàng hóa phi pháp hoặc thuộc diện kiểm soát',
            'Bắt nạt hoặc quấy rối',
            'Vi phạm quyền sở hữu trí tuệ',
            'Thông tin sai sự thật',
            'Tự tử, tự gây thương tích hoặc chứng rối loạn ăn uống',
            'Chất cấm, chất gây nghiện',
            'Chỉ là tôi không thích nội dung này'
        ]
    },
    {
        reportUser: [
            'Đăng nội dung không nên xuất hiện trên Utegram',
            'Tài khoản này giả mạo ai đó',
            'Người dùng tài khoản này có thể chưa đủ 13 tuổi',
        ]
    }

]


