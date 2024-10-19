import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import { type } from '@testing-library/user-event/dist/type';

export default function SelectedListItem({ closeModal, author, type, postId }) {

    const navigate = useNavigate();

    const handleMoreFormPostClick = (item) => {
        if (item === 'Đi đến bài viết') {
            navigate(`/post/${postId}`);
        }
    };

    let data

    console.log(type +' '+ postId)

    if (type === 'post') {
        data = author === '@helloimnik' ? optionItem[0].content[1] : optionItem[0].content[0]
    }
    else if (type === 'comment') {
        data = author === '@helloimnik' ? optionItem[1].content[1] : optionItem[1].content[0]
    }

    return (
        <Box sx={{ width: '400px', bgcolor: 'background.paper', marginTop: '100px', border: 1, borderColor: '#777777', borderRadius: 3 }}>
            <ListItemButton
                onClick={() => {}}
                sx={{ width: '400px', height: '48px', justifyContent: 'center' }}

            >
                <span style={{ color: '#ED4956' }}>{data.top}</span>
            </ListItemButton>
            <List sx={{ padding: 0 }}>
                {data.body.map((item) => (
                    <ListItem sx={{ width: '400px', height: '48px', padding: 0 }}>
                        <Divider />
                        <ListItemButton
                            onClick={() => handleMoreFormPostClick(item)}
                            sx={{ width: '400px', height: '48px', justifyContent: 'center' }}
                        >
                            <span>{item}</span>
                        </ListItemButton>
                        <Divider />
                    </ListItem>
                ))}
            </List>
            <ListItemButton
                onClick={() => {
                    closeModal()
                }}
                sx={{ width: '400px', height: '48px', justifyContent: 'center' }}
            >
                <span>Hủy</span>
            </ListItemButton>
        </Box>
    );
}

const optionItem = [
    {
        type: 'post',
        content: [
            {
                top: 'Báo cáo',
                body: ['Đi đến bài viết'],
            },
            {
                top: 'Xóa',
                body: ['Chỉnh sửa', 'Đi đến bài viết'],
            }
        ]
    },
    {
        type: 'comment',
        content: [
            {
                top: 'Báo cáo',
                body: [],
            },
            {
                top: 'Xóa',
                body: [],
            }
        ]
    }
]
