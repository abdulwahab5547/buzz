// import ProfilePic from '../../assets/profile.jpg'
import PostPic from '../../assets/post.jpeg'
import Dummy1 from './../../assets/dummy1.jpg'
import Dummy2 from './../../assets/dummy2.jpg'
import Dummy3 from './../../assets/dummy3.jpg'
import Invisible from './../../assets/invisible.jpg'
// import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Post from './Post'
import UserProfile from './UserProfile'
// import Settings from '../Others/Settings'
import '../Others/Settings.css'
import AddPost from '../Others/AddPost'
import Overlay from '../Overlay/Overlay'
import '../Others/AddPost.css'


import { useNavigate } from 'react-router-dom';

function Feed({colors, setIsLoading, handleExplore, fetchPosts, users, posts, setPosts, savedPosts, toggleFollow, userFollowStatuses}){
    const navigate = useNavigate();

    const handleProfile = () => {
        setIsLoading(true);

        setTimeout(() => {
        setIsLoading(false); 
        navigate('/profile'); 
        }, 500);
    };

    const handleSettings = () => {
        setIsLoading(true);

        setTimeout(() => {
        setIsLoading(false); 
        navigate('/settings'); 
        }, 500);
    };

    const handleProfileClick = (username) => {
        setIsLoading(true);

        setTimeout(() => {
        setIsLoading(false); 
        navigate(`/profile/${username}`);
        }, 500);
    };

    const [feedData, setFeedData] = useState({});

    const updateFeed = (updatedUserData) => {
        setFeedData(updatedUserData);
    };

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        location: '',
        workCompany: '',
        twitter: '',
        instagram: '',
        profileImage: '',
    });

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No token found');
            toast.info('Please log in to use all features.');
            return;
        }

        const response = await axios.get('http://localhost:8000/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('User data response:', response.data);

        setUserData(response.data);

        if (updateFeed) {
            updateFeed(response.data);
        }

        setUserData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Token is invalid or expired:', error);
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            } else if (error.response && error.response.status === 404) {
                console.error('Route not found:', error);
                toast.error('The requested resource was not found.');
            } else {
                console.error('Error fetching user data:', error);
                toast.error("There was an error fetching user data. Make sure you're logged in.");
            }
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    // * add post part

    const [postCaption, setPostCaption] = useState('');
    const [postImage, setPostImage] = useState('');
    const [postLocation, setPostLocation] = useState('');
    const [postHashtags, setPostHashtags] = useState('');

    const handleAddPost = async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.error('No token found');
            toast.info('Please log in to use all features.');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', postImage);  // Append the image file to FormData
        formData.append('caption', postCaption);
        formData.append('location', postLocation);
        formData.append('hashtags', postHashtags);
    
        try {
            // Post the new post
            const response = await axios.post('http://localhost:8000/api/new-post', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            const newPost = response.data;
    
            console.log('Post added:', newPost);

            setShowAddPost(false);
    
            // Reset state
            setPostCaption('');
            setPostImage(null);  // Reset image file
            setPostLocation('');
            setPostHashtags('');

            fetchPosts();
            
        } catch (error) {
            console.error('Error adding post:', error.response ? error.response.data : error.message);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPostImage(file);  // Store the file object instead of the URL
        }
    };

    const handleLocationChange = (event) => {
        setPostLocation(event.target.value);
    };

    const handleCaptionChange = (event) => {
        setPostCaption(event.target.value);
    };

    const handleHashtagChange = (event) => {
        setPostHashtags(event.target.value);
    };

    // * add reel

    const [reelVideo, setReelVideo] = useState(null);
    const [caption, setCaption] = useState(''); // State for caption

    const handleVideoChange = (e) => {
        setReelVideo(e.target.files[0]);
    };

    const handleReelCaptionChange = (e) => {
        setCaption(e.target.value); 
    };

    // * show/hide add post component

    const [showAddPost, setShowAddPost] = useState(false);
    const handleInputClick = () => {
        setShowAddPost(true);
    };

    // Function to handle hiding the add-post element
    const handleCancelClick = () => {
        setShowAddPost(false);
    };

    // * show/hide reel component

    const [showAddReel, setShowAddReel] = useState(false);
    const handleReelClick = () => {
        setShowAddReel(true);
    };

    // Function to handle hiding the add-post element
    const handleReelCancelClick = () => {
        setShowAddReel(false);
    };
 
    const hasMoreUsers = users.length > 3;

    const handleAddReel = async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.error('No token found');
            toast.info('Please log in to use all features.');
            return;
        }
    
        const formData = new FormData();
        formData.append('video', reelVideo);  // Append the video file to FormData
        formData.append('caption', caption);  // Append the caption to FormData
        
        try {
            const response = await axios.post('http://localhost:8000/api/new-reel', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log('Reel added:', response.data);
    
            handleReelCancelClick();
    
            // Reset video file, caption, or any other state if needed
            setReelVideo(null);
            setCaption('');
        } catch (error) {
            console.error('Error adding reel:', error.response ? error.response.data : error.message);
            toast.error('Error adding reel. Please try again.');
        }
    };

    return(
        <div className='home-content-container'>
            <ToastContainer />
            <div className='home-content-row'>

                <div className='home-profile-part tr px-3 col-12 col-sm-12 col-md-3 col-lg-3 py-2 pb-4 bs'
                style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                    <div className='d-flex justify-content-between py-2 px-1 align-items-center'>
                        <div className='d-flex gap align-items-center'>
                            <div className='profile-pic-div pointer' onClick={handleProfile}>
                                <img src={userData.profileImage}/>
                            </div> 
                            <div className=''>
                                <p onClick={handleProfile} className='m-0 profile-heading bold'>{feedData.firstName || 'User'}</p>
                                <p className='m-0 text-esm'>@{feedData.username}</p>
                            </div>
                        </div>
                        <div className=''>
                            <div className='hover-icon p-2' onClick={handleSettings}>
                                <i className="fa-solid fa-gear"></i> 
                            </div>                    
                        </div>
                    </div>
                    <hr className='mx-2'/>
                    <div className='profile-about-div px-2'>
                        <p className='m-0 text-esm-red pb-3'>About</p>
                        <div className='profile-location d-flex align-items-center gap'>
                            <i className="fa-solid fa-location-dot"></i> 
                            <p className='m-0 location-text text-sm'>{feedData.location || 'Add location'}</p>
                        </div>
                        <div className='profile-work d-flex align-items-center gap pt-3'>
                            <i className="fa-solid fa-briefcase"></i> 
                            <p className='m-0 location-text text-sm'>{feedData.workCompany || 'Add company'}</p>
                        </div>
                    </div>
                    <hr className='mx-2'/>
                    <div className='social-profiles-div px-2'>
                        <p className='m-0 text-esm-red pb-3'>Social profiles</p>
                        <div className='social-profile-container'>
                            <div className='social-profile d-flex align-items-center gap'>
                                <i className="fa-brands fa-twitter"></i> 
                                <p className='m-0 location-text text-sm'><a href={feedData.twitter || '#'}>Twitter</a></p>
                            </div>
                            <div className='social-profile d-flex align-items-center gap pt-3'>
                                <i className="fa-brands fa-instagram"></i> 
                                <p className='m-0 location-text text-sm'><a href={feedData.instagram || '#'}>Instagram</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='home-feed-part col-12 col-sm-12 col-md-5 col-lg-5'>

                {/* <UserProfile colors={colors} username={'abdulwahabshere'}/> */}

                <div className='add-post-part tr bs' style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                    <div>

                        {/* Whats on your mind */}

                        <div className={`d-flex py-lg-3 py-md-3 px-lg-4 px-md-4 p-sm-3 p-3 new-post-div gap align-items-center ${showAddPost || showAddReel ? 'justify-content-center' : 'justify-content-between'}`}>
                            <div className='profile-pic-div'>
                                <img src={userData.profileImage} alt="Profile" />
                            </div>
                            {!showAddPost && !showAddReel && (
                            <div className='post-input-div'>
                                <input
                                    type="text"
                                    placeholder="What's on your mind...."
                                    className="py-3 px-3 post-input"
                                    style={{ color: colors.Text, backgroundColor: colors.Input }}
                                    onClick={handleInputClick}
                                />
                            </div>
                            )}
                        </div>
                        
                        {!showAddPost && !showAddReel && (
                        <div className='add-post-icons flex-wrap justify-content-between py-2 px-3'>
                            <div
                                className='d-flex align-items-center gap hover-icon p-2 px-3'
                                onClick={handleInputClick}
                            >
                                <span><i className="fa-solid fa-image"></i></span>
                                <span className='text-sm'>Image</span>
                            </div>
                            <div
                                className='d-flex align-items-center gap hover-icon p-2 px-3'
                                onClick={handleInputClick}
                            >
                                <span><i className="fa-solid fa-pen-nib"></i></span>
                                <span className='text-sm'>Text</span>
                            </div>
                            <div
                                className='d-flex align-items-center gap hover-icon p-2 px-3'
                                onClick={handleReelClick}
                            >
                                <span><i className="fa-solid fa-video"></i></span>
                                <span className='text-sm'>Reel</span>
                            </div>
                        </div>
                        )}

                        <div className={`add-reel-wrapper add-post-wrapper ${showAddReel ? 'show' : ''}`}>
                            <div className={`add-reel px-3 pb-3 ${showAddReel ? 'show' : ''}`}>
                            <div className="add-post-content px-1 py-2">      
                                <div className="add-post-text pb-1">
                                    <p className="pb-2 m-0 text-esm-red">Add a caption?</p>
                                    <textarea
                                        placeholder="Start typing..."
                                        className="py-3 px-3 add-post-input text-sm"
                                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                                        value={caption} 
                                        onChange={handleReelCaptionChange}
                                        autoFocus
                                    />
                                </div>
                                <hr />
                                <div className="add-post-media py-2">
                                    <p className="pb-2 m-0 text-esm-red">Add media</p>
                                    <div className='d-flex gap justify-content-between align-items-center pt-3'>
                                        <div>
                                            <input 
                                                style={{ color: colors.Text, backgroundColor: colors.Input }} 
                                                type="file" 
                                                accept="video/*" 
                                                className='br add-post-media-input text-sm' 
                                                onChange={handleVideoChange} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="post-div pt-2">
                                    <div className='pt-2 d-flex justify-content-between'>
                                        <button onClick={handleReelCancelClick} className='cancel-post-btn normal-btn px-3'>Cancel</button>
                                        <button onClick={handleAddReel} className='normal-btn px-3'>Post</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                            
                        
                        </div>

                        {/* Add post dropdown */}
                        <div className={`add-post-wrapper ${showAddPost ? 'show' : ''}`}>
                            
                        <div className={`add-post pb-4 px-4 br ${showAddPost ? 'show' : ''}`} style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                            <div className="add-post-content px-1 py-2">      
                                <div className="add-post-text pb-1">
                                    <p className="pb-2 m-0 text-esm-red">Add a caption?</p>
                                    <textarea
                                        placeholder="Start typing..."
                                        className="py-3 px-3 add-post-input text-sm"
                                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                                        value={postCaption} 
                                        onChange={handleCaptionChange}
                                        autoFocus
                                    />
                                </div>
                                <hr />
                                <div className="add-post-text pb-1">
                                    <p className="pb-2 m-0 text-esm-red">Add hashtags?</p>
                                    <textarea
                                        placeholder="Enter hashtags (separate by space)..."
                                        className="py-3 px-3 add-post-input text-sm"
                                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                                        value={postHashtags} 
                                        onChange={handleHashtagChange}
                                    />
                                </div>
                                <hr />
                                <div className='add-post-location pb-3 pt-2'>
                                    <p className="pb-2 m-0 text-esm-red">Where are you?</p>
                                    <input
                                        type="text" 
                                        placeholder="Add location" 
                                        className='add-location-input br text-sm py-1 px-3'
                                        value={postLocation} 
                                        onChange={handleLocationChange} 
                                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                                    />
                                </div>
                                <hr />
                                <div className="add-post-media py-2">
                                    <p className="pb-2 m-0 text-esm-red">Add media</p>
                                    <div className='d-flex gap justify-content-between align-items-center pt-3'>
                                        <div>
                                            <input 
                                                style={{ color: colors.Text, backgroundColor: colors.Input }} 
                                                type="file" 
                                                className='br add-post-media-input text-sm' 
                                                onChange={handleImageChange} 
                                                
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="post-div pt-2">
                                    <div className='pt-2 d-flex justify-content-between'>
                                        <button onClick={handleCancelClick} className='cancel-post-btn normal-btn px-3'>Cancel</button>
                                        <button onClick={handleAddPost} className='normal-btn px-3'>Post</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                
                </div>
                    <div>
                    {posts.length > 0 ? (
                        posts.slice().reverse().map((post) => (
                            <Post 
                                postID={post._id} 
                                colors={colors}
                                image={post.image}
                                caption={post.caption}
                                likes={post.likes}
                                hashtags={post.hashtags}
                                user={post.user}
                                location={post.location}
                                setPosts={setPosts}
                                userData={userData}
                                isSaved={savedPosts.includes(post._id)}
                                toggleFollow={toggleFollow}
                                userFollowStatuses={userFollowStatuses}
                            />
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                        <div className='invisible-div'>
                            <img className='invisible-img' src={Invisible} />
                        </div>
                    </div>
                    

                </div>

                

                <div className='home-friends-part tr px-3 col-12 col-sm-12 col-md-3 col-lg-3 bs py-2'
                style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                    <div className='py-2 px-1'>
                        <p className='m-0 text-esm-red pb-1 pt-2'>Explore</p>
                        {users.slice(0, 3).map(user => (
                            <div key={user._id} className='d-flex justify-content-between py-3 align-items-center'>
                                <div className='d-flex gap align-items-center'>
                                    <div onClick={() => handleProfileClick(user.username)} className='profile-pic-div user-profile-div d-flex justify-content-center align-items-center pointer'>
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="Profile" />
                                        ) : (
                                            <i className="p-1 fa-solid fa-user user-icon"></i>
                                        )}
                                    </div>
                                    <div>
                                        <p onClick={() => handleProfileClick(user.username)} className='m-0 profile-heading bold'>{user.firstName} {user.lastName}</p>
                                        <p className='m-0 text-esm'>@{user.username}</p>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className='hover-icon follow p-2 pointer'
                                        onClick={() => toggleFollow(user._id)}
                                    >
                                        <p className='follow-unfollow-para m-0 text-xsm-red'>
                                            {userFollowStatuses[user._id] ? 'Unfollow' : 'Follow'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {hasMoreUsers && (
                            <div className='my-1 mt-2'>
                                <p onClick={handleExplore} className='m-0 text-esm-red pb-1 pt-2 pointer'>Show More...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed;