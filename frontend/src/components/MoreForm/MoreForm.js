import * as React from 'react';

// Material UI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import { type } from '@testing-library/user-event/dist/type';

export default function SelectedListItem({ closeModal, author, type }) {
    const [selectedIndex, setSelectedIndex] = React.useState([]);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    let data

    if (type === 'post') {
        data = author === '@helloimnik' ? optionItem[1].content[1] : optionItem[1].content[0]
    }
    else if (type === 'comment') {
        data = author === '@helloimnik' ? optionItem[1].content[1] : optionItem[1].content[0]
    }

    return (
        <Box sx={{ width: '400px', bgcolor: 'background.paper', marginTop: '100px', border: 1, borderColor: '#777777', borderRadius: 3 }}>
            <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
                sx={{ width: '400px', height: '48px', justifyContent: 'center' }}

            >
                <span style={{ color: '#ED4956' }}>{data.top}</span>
            </ListItemButton>
            <List sx={{ padding: 0 }}>
                {data.body.map((item) => (
                    <ListItem sx={{ width: '400px', height: '48px', padding: 0 }}>
                        <Divider />
                        <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={(event) => handleListItemClick(event, 2)}
                            sx={{ width: '400px', height: '48px', justifyContent: 'center' }}
                        >
                            <span>{item}</span>
                        </ListItemButton>
                        <Divider />
                    </ListItem>
                ))}
            </List>
            <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => {
                    handleListItemClick(event, 3)
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
                body: ['Đi đến bài viết', 'Sao chép liên kết'],
            },
            {
                top: 'Xóa',
                body: ['Chỉnh sửa', 'Đi đến bài viết', 'Sao chép liên kết'],
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
