import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Overlay from '../Overlay/Overlay'
import './UserProfile.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserProfile({colors, handleMessages}){
    const { username } = useParams();

    const fetchUserProfile = async (username) => {
        try {
            // const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8000/api/profile/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('User not found or an error occurred');
            }

            const userData = await response.json();
            const {
                firstName,
                lastName,
                username: user,
                bio,
                location,
                profileImage,
                _id: userId,
                followerCount,
                followingCount
            } = userData;
            return { firstName, lastName, user, bio, location, profileImage, userId, followerCount, followingCount };
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
        }
    };
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    useEffect(() => {
        async function loadProfile() {
            const userProfile = await fetchUserProfile(username);
            setProfile(userProfile);
            if (userProfile) {
                checkFollowStatus(userProfile.userId);
            }
        }
        loadProfile();
    }, [username]);

    // Follow

    const checkFollowStatus = async (targetUserId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:8000/api/check-follow/${targetUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsFollowing(response.data.isFollowing);
            fetchUserProfile();
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const toggleFollow = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:8000/api/follow', {
                targetUserId: profile.userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsFollowing((prev) => !prev);

            const updatedProfile = await fetchUserProfile(username);
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
    };

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const getFollowing = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/following/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data; // This will be an array of users
        } catch (error) {
            console.error('Error fetching following users:', error);
            return [];
        }
    };
    
    
    // Function to get users who are following a particular user
    const getFollowers = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/followers/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            return response.data; // This will be an array of users
        } catch (error) {
            console.error('Error fetching followers:', error);
            return [];
        }
    };

    

    useEffect(() => {
        const fetchData = async () => {
            const followingUsers = await getFollowing(username);
            const followerUsers = await getFollowers(username);

            setFollowing(followingUsers);
            setFollowers(followerUsers);
        };

        fetchData();
    }, [username]);


    const [posts, setPosts] = useState([]);
    async function fetchUserPosts(username) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:8000/api/profile-posts/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user posts:", error);
            return null;
        }
    }
    useEffect(() => {
        async function loadProfile() {
            const userPosts = await fetchUserPosts(username);
            if (userPosts) {
                setPosts(userPosts);
            }
        }
        loadProfile();
    }, [username]);


    // Followers following visibility


    const [areFollowersVisible, setAreFollowersVisible] = useState(false);

    const handleFollowersToggle = () => {
        setAreFollowersVisible(!areFollowersVisible);
    };

    const [areFollowingVisible, setAreFollowingVisible] = useState(false);

    const handleFollowingToggle = () => {
        setAreFollowingVisible(!areFollowingVisible);
    };

    // Overlay

    const handleCloseOverlay = () => {
        setAreFollowingVisible(false);
        setAreFollowersVisible(false);
    };
    
    return(
        
        <div className="profile">
            <ToastContainer/>

            {profile ? (
            <div className="profile-details p-4 pt-5 br bs d-flex flex-column align-items-center"
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <div className='profile-details-inner px-1 extra-gap'>

                    <div className='profile-prp' >
                        {profile.profileImage ? (
                        <img
                            className='prp-image'
                            src={profile.profileImage}
                        />
                        ) : (
                            <i className="p-1 fa-solid fa-user prp-image"></i>
                        )}
                    </div>
                    <div className='profile-details-part px-1'>
                        <div className='username-div pt-2 d-flex gap align-items-center'>
                            <input 
                                style={{ color: colors.Text, backgroundColor: colors.Highlight }}
                                className='text-lg bold'
                                type="text"
                                value={profile.user} 
                                readOnly
                            />
                        </div>

                        <div className='profile-info py-2 pt-3 extra-gap'>
                            <span className='text-sm'>{posts.length} posts</span>
                            <span onClick={() => setAreFollowersVisible(true)} className='text-sm pointer'>{profile.followerCount} followers</span>
                            <span onClick={() => setAreFollowingVisible(true)} className='text-sm pointer'>{profile.followingCount} following</span>
                        </div>

                        <div>
                            <p className='m-0 text-lg bold pt-3 pb-2'>{profile.firstName} {profile.lastName}</p>
                            <div className='bio-textarea-div pt-1'>
                                <textarea
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}
                                    className='text-sm pt-2 br'
                                    value={profile.bio}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='profile-inner-btns gap d-flex py-3'>
                    {isFollowing ? (
                        <button className='normal-btn px-3' onClick={toggleFollow}>Unfollow</button>
                    ) : (
                        <button className='normal-btn px-3' onClick={toggleFollow}>Follow</button>
                    )}
                    <button onClick={handleMessages} className='normal-btn px-3'>Message</button>
                </div>
                
            </div>

            ) : (
                <p>Loading profile...</p>
            )}

            <Overlay
                isVisible={areFollowersVisible}
                onClose={handleCloseOverlay}
                colors={colors}
            >
                <div className='px-3 br py-3' style={{color: colors.Text, backgroundColor: colors.Background}}>
                <p className='m-0 text-esm-red pt-2 pb-3'>Followers</p>
                {followers.map(user => (
                    <div key={user._id} className='follow-overlay br bs py-3'>
                    <div className='d-flex gap align-items-center comment-img'>
                        <img src={user.profileImage}/>
                        <div>
                            <p className='text-esm m-0'><strong className='m-0'>{user.username}</strong></p>
                        </div>
                    </div>
                    
                    </div>
                ))}
                </div>
            </Overlay>

            <Overlay
                isVisible={areFollowingVisible}
                onClose={handleCloseOverlay}
                colors={colors}
            >
                <div className='px-3 br py-3' style={{color: colors.Text, backgroundColor: colors.Background}}>
                <p className='m-0 text-esm-red pt-2 pb-3'>Following</p>
                {following.map(user => (
                    <div key={user._id} className='follow-overlay br bs py-3'>
                    <div className='d-flex gap align-items-center comment-img'>
                        <img src={user.profileImage}/>
                        <div>
                            <p className='text-esm m-0'><strong className='m-0'>{user.username}</strong></p>
                        </div>
                    </div>
                    
                    </div>
                ))}
                </div>
            </Overlay>

            <div className="profile-media bs p-4 pt-5 mt-4 mb-3 br"
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <p className="text-lg text-center">Image posts</p>
                <hr/>

                <div className='profile-posts row pt-2'>
                    {posts.length > 0 ? (
                        posts
                            .filter(post => post.image) // Filter out posts without a valid image
                            .slice().reverse()
                            .map((post, index) => (
                                <div key={index} className='profile-post col-12 col-sm-6 col-lg-4 col-md-4 py-2'>
                                    <div className='profile-post-image-wrapper'>
                                        <img src={post.image} className='br'/>
                                        <p className='profile-post-caption m-0 text-esm'>{post.caption}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className='text-sm'>No posts available</p>
                    )}
                </div>
            </div>

            <div className="profile-media bs p-4 pt-5 mt-4 mb-3 br"
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <p className="text-lg text-center">Text posts</p>
                <hr/>

                <div className='profile-text-posts row pt-2 px-2'>
                    {posts.length > 0 ? (
                        posts
                            .filter(post => !post.image) 
                            .slice().reverse()
                            .map((post, index) => (
                                <div key={index} className='text-only-post col-12 col-sm-6 col-lg-4 px-2 py-2'>
                                    <div className='br px-3 py-3 text-only-post-inner' style={{color: colors.Text, backgroundColor: colors.Input}}>
                                        <p className='m-0 text-only-caption text-sm'>{post.caption}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className='text-sm'>No posts available</p>
                    )}
                </div>
            </div> 

        </div>
        
    )
}

export default UserProfile; 


