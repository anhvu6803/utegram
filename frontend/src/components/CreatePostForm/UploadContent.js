import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SetContent from './SetContent';
import FinishCreate from './FinishCreate';


// Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ImageListItem } from '@mui/material';
import ImageList from '@mui/material/ImageList';

// Material UI icon
import ClearIcon from '@mui/icons-material/Clear';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import AddIcon from '@mui/icons-material/Add';


import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";



export default function UploadContent({ closeModal }) {
    const [publicId, setPublicId] = useState("");
    // Replace with your own cloud name
    const [cloudName] = useState("dbmynlh3f");

    const [uploadPreset] = useState("tlcn2024");

    const [uwConfig] = useState({
        cloudName,
        uploadPreset
    });

    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary({
        cloud: {
            cloudName
        }
    });

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

        console.log(fileUrls.length)

        if (fileUrls.length <= 0) {
            handleRemoveAllFile();
            setItemDisplay(null);
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
                    closeModal()
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
                        <FinishCreate isLoading={false}/>
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
                                                }}
                                                sx={{
                                                    height: '25px', width: '25px', marginLeft: '20px'
                                                }}
                                            >
                                                <KeyboardBackspaceIcon sx={{ fontSize: 25, color: 'black' }} />
                                            </IconButton>

                                            <span
                                                onClick={() => { setChangeFinishCreate(true) }}
                                                style={{
                                                    fontSize: 15, fontWeight: 'normal',
                                                    marginRight: '20px', color: '#0095F6',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Chia sẻ
                                            </span>
                                        </Box>
                                        <SetContent fileUrls={fileUrls} files={files} />
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
                                                                            display: 'flex',
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
                                                                                display: 'flex',
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
                                                                                                    background: 'rgba(51, 51, 51, 0.5)', zIndex: 100, background: 'rgba(0, 0, 0, 0)'
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

            </Box>
        </div>
    );
}

