import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

// Material UI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// Material UI icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function SelectedListItem({ closeModal, author, type, itemId, user, commentId }) {
    const auth = useContext(AuthContext);

    const { timeLoading, error, sendRequest, clearError } = useHttpClient();

    const [isReport, setReport] = useState(false);
    const [isSuccessReport, setSuccessReport] = useState(false);

    const navigate = useNavigate();

    const handleMoreFormPostClick = (item) => {
        if (item === 'Đi đến bài viết') {
            navigate(`/post/${itemId}`);
            window.location.reload();
        }
    };

    const handleTopClick = (event, item) => {
        if (item === 'Báo cáo') {
            setReport(!isReport);
        }
        else if (item === 'Chặn') {

        }
        else if (item === 'Xóa') {
            handleDelete(event);
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
            window.location.reload();
        } catch (err) {

        }

    }

    let data, report, typeChange, username;

    if (type === 'post') {
        data = author === auth.userId ? optionItem[0].content[1] : optionItem[0].content[0]
        report = reportData[0].reportPost;
        typeChange = 'bài viết';
        username = user.username
    }
    else if (type === 'comment' || type === 'reply') {
        data = author === auth.userId ? optionItem[1].content[1] : optionItem[1].content[0]
        report = reportData[1].reportComment;
        typeChange = 'bình luận';
        username = user.author.username;
    }
    else if (type === 'user') {
        data = author === auth.userId ? optionItem[2].content[1] : optionItem[2].content[0]
        report = reportData[2].reportUser;
        typeChange = 'người dùng'
    }

    return (
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
                        <span
                            style={{
                                fontSize: 17, fontWeight: 'normal', marginTop: '40px',
                                width: '380px', textAlign: 'left', color: '#ED4956',
                                cursor: 'pointer'
                            }}
                        >
                            {`Chặn ${username}`}
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
                                            onClick={() => handleMoreFormPostClick(item)}
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


