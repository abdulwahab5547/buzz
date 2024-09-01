import './ReelsPage.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function ReelsPage({ colors }) {

    // State to store reels data
    const [reels, setReels] = useState([]);

    // Fetch reels on component mount
    useEffect(() => {
        const fetchReels = async () => {
            try {
                const response = await axios.get('https://buzz-backend-pied.vercel.app/api/new-reel');
                setReels(response.data);
            } catch (error) {
                console.error('Error fetching reels:', error.response ? error.response.data : error.message);
            }
        };
        fetchReels();
    }, []);

    // State to manage caption visibility
    const [isCaptionVisible, setIsCaptionVisible] = useState(false);

    // Toggle caption visibility
    const handleToggleCaption = () => {
        setIsCaptionVisible(!isCaptionVisible);
    };

    const [areCommentsVisible, setAreCommentsVisible] = useState(false);

    const handleCommentsToggle = () => {
        setAreCommentsVisible(!areCommentsVisible);
    };

    // State to track the current reel being displayed
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isVideoVisible, setIsVideoVisible] = useState(true);

    const handleArrowUp = () => {
        if (currentReelIndex > 0) {
            setIsVideoVisible(false);
            setTimeout(() => {
                setCurrentReelIndex(currentReelIndex - 1);
                setIsVideoVisible(true);
            }, 500);  // Duration of the fade-out effect
        }
    };

    const handleArrowDown = () => {
        if (currentReelIndex < reels.length - 1) {
            setIsVideoVisible(false);
            setTimeout(() => {
                setCurrentReelIndex(currentReelIndex + 1);
                setIsVideoVisible(true);
            }, 500);  // Duration of the fade-out effect
        }
    };

    // Get the current reel based on the index
    const currentReel = reels[currentReelIndex];

    

    return (
        <div className='reels max-reel-content'>
            <div className='reels-inner d-flex extra-gap justify-content-center flex-column align-items-center'>

                {reels.length > 0 ? (
                    <div  className='reel br bs tr mb-5'>
                        {/* Reel part */}
                        <div className='reel-video-div'>
                            <video 
                            key={currentReel.video}
                            autoPlay controls
                            className={`video-part br ${isVideoVisible ? 'reel-visible' : 'reel-fade'}`}
                            onEnded={() => setIsVideoVisible(false)}
                            >
                                <source src={currentReel.video} type="video/mp4" />
                                
                            </video>

                            {/* Top */}
                            <div className='reel-info br-top py-2 px-1 px-3'>
                                <div className='d-flex gap align-items-center'>
                                    <div className='profile-pic-div reel-profile-img'>
                                        <img src={currentReel.user.profileImage} alt="Profile" />
                                    </div>
                                    <div className=''>
                                        <p className='m-0 profile-heading bold'>{currentReel.user.firstName} {currentReel.user.lastName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Left info */}
                            <div className='pic-and-caption d-flex flex-column justify-content-center gap'>
                                <div className='profile-pic-div pointer'>
                                    <img src={currentReel.user.profileImage} alt="Profile" className='bs'/>
                                </div>
                                <div onClick={handleToggleCaption}
                                    className='text-esm bs d-flex justify-content-center align-items-center caption-icon-div pointer'
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                                    <i className={`fa-solid ${isCaptionVisible ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
                                </div>
                                <div onClick={handleCommentsToggle}
                                className='caption-icon-div d-flex justify-content-center align-items-center pointer'
                                style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                                    <i className="fa-solid fa-message"></i>
                                </div>
                            </div>

                            {/* Left caption */}
                            {isCaptionVisible && (
                                <div
                                    className='caption-div bs br-left p-3 px-4'
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}
                                >
                                    <p className='m-0 text-esm-red pb-1 pt-2'>Caption</p>
                                    <p className='m-0 text-sm'>{currentReel.caption}</p>
                                </div>
                            )}

                            {areCommentsVisible && (
                                <div
                                    className='reel-comments-div bs br-left p-3 px-4'
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}
                                >
                                    <p className='m-0 text-esm-red pb-1 pt-2'>Comments</p>
                                    <p className='m-0 text-esm'>Comments here</p>
                                </div>
                            )}

                            {/* Reel Arrows Right */}
                            <div className='reel-arrows d-flex flex-column justify-content-center align-items-center gap'>
                                <div onClick={handleArrowUp}
                                    className='reel-arrow-up bs caption-icon-div d-flex align-items-center justify-content-center pointer'
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                                    <i className='fa-solid fa-arrow-up'></i>
                                </div>
                                <div onClick={handleArrowDown}
                                    className='reel-arrow-down bs caption-icon-div d-flex align-items-center justify-content-center pointer'
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                                    <i className='fa-solid fa-arrow-down'></i>
                                </div>
                            </div>

                        </div>

                    </div>
                ) : (
                    <p>No reels available</p>
                )}

            </div>
        </div>
    );
}

export default ReelsPage;
