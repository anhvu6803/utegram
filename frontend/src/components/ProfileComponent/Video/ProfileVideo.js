import React from 'react';
import './ProfileVideo.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import imgnovideo from '../../../assets/img-no-video.jpg';
import { Link } from 'react-router-dom';
const ProfileVideo = () => {
    return (
        <div className='profile-video'>
            <div className='home-container'>
                {itemData.length === 0 ? (
                    <div className="no-video">
                        <img src= {imgnovideo} ></img>
                        <div className='title-no-video'>
                            Chia sẻ video
                        </div>
                        <div className='desc-no-video'>
                            Khi bạn chia sẻ video, video sẽ xuất hiện trên trang cá nhân của bạn.
                        </div>
                        <div className='no-video-link'>
                            <Link> Chia sẻ video đầu tiên của bạn</Link>
                        </div>
                    </div>
                ) : (
                    <ImageList cols={3} sx={{ width: '100%', height: '100%', marginTop: '50px' }}>
                        {itemData.map((item) => (
                            <ImageListItem key={item.img}>
                                <img
                                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.img}?w=248&fit=crop&auto=format`}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{ width: '300px', height: '300px' }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}
            </div>
        </div>
    );
}

export default ProfileVideo;

const itemData = [
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     video: 'https://drive.google.com/file/d/1-CH55SyMirhBeEBB7gbLFHUPBos8S2K4/view?usp=sharing',
    //     //img: 'https://youtu.be/LIgldcjERSk',
    //     img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    //     title: 'Breakfast',
    //     author: '@bkristastucchio',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    //     title: 'Burger',
    //     author: '@rollelflex_graphy726',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    //     title: 'Camera',
    //     author: '@helloimnik',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    //     title: 'Coffee',
    //     author: '@nolanissac',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    //     title: 'Hats',
    //     author: '@hjrc33',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    //     title: 'Honey',
    //     author: '@arwinneil',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    //     title: 'Basketball',
    //     author: '@tjdragotta',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    //     title: 'Fern',
    //     author: '@katie_wasserman',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    //     title: 'Mushrooms',
    //     author: '@silverdalex',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    //     title: 'Tomato basil',
    //     author: '@shelleypauls',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    //     title: 'Sea star',
    //     author: '@peterlaster',
    // },
    // {
    //     username: 'wasabi123',
    //     date: '12/3/2024',
    //     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    //     title: 'Bike',
    //     author: '@southside_customs',
    // },
];