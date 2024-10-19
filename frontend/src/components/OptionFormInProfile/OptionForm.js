 import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

export default function OptionForm({ closeModal, author, openReportForm }) {
    const [selectedIndex, setSelectedIndex] = React.useState(null);

  
    const data = author === '@admin' ? optionItemAdmin : optionItemUser;

    const handleListItemClick = (event, index) => {
        if (index === 0) {  
            openReportForm(); 
        } else {
            setSelectedIndex(index);
        }
    };

    return (
        <Box sx={{ width: '400px', bgcolor: 'background.paper', marginTop: '100px', border: 1, borderColor: '#777777', borderRadius: 3 }}>
            <List sx={{ padding: 0 }}>
                {data.body.map((item, index) => (
                    <ListItem key={index} sx={{ width: '400px', height: '48px', padding: 0 }}>
                        <Divider />
                        <ListItemButton
                            selected={selectedIndex === index}
                            onClick={(event) => handleListItemClick(event, index)}
                            sx={{ width: '400px', height: '48px', justifyContent: 'center' }}
                        >
                            <span style={{ color: item === 'Báo cáo' || item === 'Chặn người dùng' ? 'red' : 'inherit', fontWeight: item === 'Báo cáo' || item === 'Chặn người dùng' ? 'bold' : 'normal' }}>
                                {item}
                            </span>
                        </ListItemButton>
                        <Divider />
                    </ListItem>
                ))}
            </List>
            <ListItemButton
                selected={selectedIndex === data.body.length} 
                onClick={() => {
                    setSelectedIndex(data.body.length);
                    closeModal();  
                }}
                sx={{ width: '400px', height: '48px', justifyContent: 'center' }}
            >
                <span>Hủy</span>
            </ListItemButton>
        </Box>
    );
}

 
const optionItemUser = {
    body: ['Báo cáo', 'Chặn người dùng', 'Sao chép liên kết'],
};
 
const optionItemAdmin = {
    body: ['Báo cáo', 'Chặn người dùng'],
};
