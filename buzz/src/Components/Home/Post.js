import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostPic from '../../assets/post.jpeg';
import ProfilePic from '../../assets/profile.jpg';
import './Post.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Post({postID, colors, image, likes, caption, user, location, setPosts, userData, hashtags, toggleFollow, userFollowStatuses}) {
    const [animateHeart, setAnimateHeart] = useState(false);
    const [animateBookmark, setAnimateBookmark] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const checkIfPostIsLiked = async (postID) => {
        try {
            const authToken = localStorage.getItem('authToken'); 
    
            const response = await axios.get(
                `http://localhost:8000/api/is-liked/${postID}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
    
            return response.data.isLiked;
        } catch (error) {
            console.error('Error checking if post is liked:', error);
            return false;
        }
    };

    useEffect(() => {
        const checkLikedStatus = async () => {
            const likedStatus = await checkIfPostIsLiked(postID);
            setIsLiked(likedStatus);
        };

        checkLikedStatus();
    }, [postID]);

    const toggleLikePost = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const url = isLiked ? `http://localhost:8000/api/unlike-post` : `http://localhost:8000/api/like-post`;
    
            // Send request to save or unsave the post
            await axios.post(
                url,
                { postId: postID },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
    
            // Toggle the saved state and update the icon
            setAnimateHeart(true);
            setIsLiked(!isLiked);
            fetchLikedUsers();
            // toast.success(isSaved ? 'Post unsaved!' : 'Post saved!');
        } catch (error) {
            toast.error('Failed to like post.');
            console.error('Error liking post:', error);
        }
    };

    const [likedUsers, setLikedUsers] = useState([]);
    const fetchLikedUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `http://localhost:8000/api/likes/${postID}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setLikedUsers(response.data);
        } catch (error) {
            // setError('Failed to fetch liked users.');
            console.error('Error fetching liked users:', error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikedUsers();
    }, [postID]);


    const [areLikesVisible, setAreLikesVisible] = useState(false);

    const handleLikesToggle = () => {
        setAreLikesVisible(!areLikesVisible);
    };


    // setAnimateHeart(true); to use in function
    useEffect(() => {
        if (animateHeart || animateBookmark) {
            const timer = setTimeout(() => {
                setAnimateHeart(false);
                setAnimateBookmark(false);
            }, 600); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [animateHeart, animateBookmark]);

    
    // Valid image function

    const isValidImage = (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
        return new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    };

    const [showMedia, setShowMedia] = useState(false);

    useEffect(() => {
        const checkImage = async () => {
            if (image) {
                const valid = await isValidImage(image);
                setShowMedia(valid);
            } else {
                setShowMedia(false);
            }
        };

        checkImage();
    }, [image]);

    
    
    // Comments

    const [areCommentsVisible, setAreCommentsVisible] = useState(false);

    const handleCommentsToggle = () => {
        setAreCommentsVisible(!areCommentsVisible);
    };

    const [comments, setComments] = useState([]);
    const fetchComments = async (postID) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/comments/${postID}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error.response ? error.response.data : error.message);
            toast.error('Error fetching comments. Please try again.');
            return [];
        }
    };

    useEffect(() => {
        const getComments = async () => {
            const fetchedComments = await fetchComments(postID);
            setComments(fetchedComments);
        };
        getComments();
    }, [postID]);

    const [commentText, setCommentText] = useState('');

    const handleAddComment = async (postId, commentText) => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.error('No token found');
            toast.info('Please log in to use all features.');
            return;
        }
    
        if (!commentText || !postId) {
            console.error('Comment text or Post ID missing');
            toast.error('Please provide both comment text and post ID.');
            return;
        }
    
        const commentData = {
            postId,
            text: commentText
        };
    
        try {
            const response = await axios.post('http://localhost:8000/api/new-comment', commentData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Comment added:', response.data);
            const fetchedComments = await fetchComments(postID);
            setComments(fetchedComments);
        } catch (error) {
            // Safely log the error
            if (error.response) {
                console.error('Error adding comment:', error.response.data);
            } else {
                console.error('Error adding comment:', error.message);
            }
        }
    };    

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleCommentSubmit = async (postId) => {
        if (commentText.trim() === '') {
            toast.error('Comment text cannot be empty.');
            return;
        }
        
        await handleAddComment(postId, commentText);
        setCommentText(''); 
    };


    // Post save

    const [isSaved, setIsSaved] = useState(false);

    const checkIfPostIsSaved = async (postID) => {
        try {
            const authToken = localStorage.getItem('authToken');  // Get the auth token
    
            const response = await axios.get(
                `http://localhost:8000/api/is-saved/${postID}`,
                { headers: { Authorization: `Bearer ${authToken}` } }  // Attach token to request
            );
    
            return response.data.isSaved;
        } catch (error) {
            console.error('Error checking if post is saved:', error);
            return false;  // Return false if there's an error
        }
    };

    useEffect(() => {
        const checkSavedStatus = async () => {
            const savedStatus = await checkIfPostIsSaved(postID);
            setIsSaved(savedStatus);
        };

        checkSavedStatus();
    }, [postID]);

    const toggleSavePost = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const url = isSaved ? `http://localhost:8000/api/unsave-post` : `http://localhost:8000/api/save-post`;
    
            // Send request to save or unsave the post
            await axios.post(
                url,
                { postId: postID },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
    
            // Toggle the saved state and update the icon
            setAnimateBookmark(true);
            setIsSaved(!isSaved);
            // toast.success(isSaved ? 'Post unsaved!' : 'Post saved!');
        } catch (error) {
            toast.error('Failed to save post.');
            console.error('Error saving post:', error);
        }
    };

    return (
        <div className='home-feed-div mb-4 mt-4 pt-2 bs tr'
            style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
            <ToastContainer/>
            <div className='post-template'>
                <div className='d-flex justify-content-between py-2 px-1 align-items-center px-3'>
                    <div className='d-flex gap align-items-center'>
                        <div className='profile-pic-div'>
                            <img src={user.profileImage} alt="Profile" />
                        </div>
                        <div className=''>
                            <p className='m-0 profile-heading bold'>{user.firstName} {user.lastName}</p>
                            <p className='m-0 text-esm'>{location}</p>
                        </div>
                    </div>
                    <div className=''>
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

                <div className='post-container'>
                    <div className='post-caption-part px-3 pt-3 pb-2'>
                        <p className='text-esm m-0'>{caption}</p>
                        <p className='m-0 text-esm blue py-1 pt-2'>{hashtags}</p>
                    </div>

                    {showMedia && (
                        <div className='post-media'>
                            <img 
                                className={`post-image ${animateHeart ? 'animate-heart' : ''} ${animateBookmark ? 'animate-bookmark' : ''}`} 
                                src={image} 
                                alt="Post media"
                                onDoubleClick={toggleLikePost}
                            />
                            {animateHeart && (
                                <i className="fa fa-heart heart-overlay"></i>
                            )}
                            {animateBookmark && (
                                <i className="fa fa-bookmark bookmark-overlay"></i>
                            )}
                        </div>
                    )}
                    <div className='py-2 px-3'>
                        <div className='post-bottom-btns d-flex justify-content-between align-items-center'>
                            <div className='d-flex extra-gap'>
                                <div className='d-flex align-items-center'>
                                    <div className='hover-icon'>
                                        <i
                                            className={`fa-heart pointer p-2 ${isLiked ? 'liked fa-solid' : 'fa-regular'}`}
                                            onClick={toggleLikePost}
                                        ></i>
                                    </div>
                                    <div className='hover-icon'>
                                        <p onClick={handleLikesToggle} className='m-0 px-2 py-1 text-esm pointer'>{likedUsers.length ? `${likedUsers.length}` : '0'}</p>
                                    </div>
                                   
                                </div>

                                {/* Comment */}
                                <div className='hover-icon' onClick={handleCommentsToggle}>
                                    <div className='d-flex align-items-center px-2 pt-2 gap'>
                                        <i
                                            className='fa-regular fa-comment'
                                        ></i>
                                        <p className='m-0 text-esm'>{comments.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='hover-icon'>
                            <i
                                className={`fa-bookmark pointer p-2 ${isSaved ? 'fa-solid' : 'fa-regular'}`}
                                onClick={() => toggleSavePost(postID)}
                            ></i>
                            </div>
                        </div>
                        {areCommentsVisible && (
                        <div className='comments p-2'>
                            <p className='m-0 text-esm-red pb-1 pt-2'>Comments</p>
                            <div className='py-2'>
                            {comments.length > 0 ? (
                                <div>
                                    {comments.map(comment => (
                                        <div key={comment._id} className='d-flex gap comment-img align-items-center py-2'>
                                            <img src={comment.user.profileImage}/>
                                            <div>
                                                <p className='text-esm m-0'><strong className='m-0'>{comment.user.username}</strong></p>
                                                <p className='text-esm m-0'> {comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-esm m-0'>No comments yet.</p>
                            )}
                            </div>
                            <div className='add-comment d-flex flex-wrap gap align-items-center py-2'>
                                <div className='add-comment-img'>
                                    <img src={userData.profileImage}/>
                                </div>
                                <div className='add-comment-input-div'>
                                    <input
                                        type="text" 
                                        placeholder="Add comment" 
                                        className='add-comment-input br text-sm py-1 px-3'
                                        value={commentText}
                                        onChange={handleCommentChange}
                                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                                    />
                                </div>
                                <div className='add-comment-btn' onClick={() => handleCommentSubmit(postID)}>
                                    <button className='normal-btn px-2'>Post</button>
                                </div>
                                <ul>
                                    
                                </ul>
                            </div>
                            
                        </div>
                        )}

                        {areLikesVisible && (
                        <div className='comments p-2'>
                            <p className='m-0 text-esm-red pb-1 pt-2'>Likes</p>
                            <div className='py-2'>
                                {likedUsers.length > 0 ? (
                                    <div>
                                        {likedUsers.map(user => (
                                            <div key={user._id} className='d-flex gap comment-img align-items-center py-2'>
                                                <img src={user.profileImage}/>
                                                <div>
                                                    <p className='text-esm m-0'><strong className='m-0'>{user.username}</strong></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-esm m-0'>No likes yet.</p>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
