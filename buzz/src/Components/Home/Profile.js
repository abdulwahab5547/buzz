import './Profile.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile({colors}){
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [newBio, setNewBio] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [followers, setFollowers] = useState('');
    const [following, setFollowing] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [showUsernameUpdateButton, setShowUsernameUpdateButton] = useState(false);
    const [showBioUpdateButton, setShowBioUpdateButton] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsername(response.data.username);
            setNewUsername(response.data.username);
            setNewBio(response.data.bio);
            setProfilePic(response.data.profileImage);
            setFollowers(response.data.followers);
            setFollowing(response.data.following);
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
          } catch (error) {
            console.log('Failed to fetch user data');
          }
        };
        fetchUserData();
    }, []);

    const handleEditClick = (field) => {
        if (field === 'username') {
            setIsEditingUsername(true);
            setShowUsernameUpdateButton(true);
        } else if (field === 'bio') {
            setIsEditingBio(true);
            setShowBioUpdateButton(true);
        }
    };

    const handleUpdate = async (field) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put('http://localhost:8000/api/user', 
            { 
                username: field === 'username' ? newUsername : username,
                bio: field === 'bio' ? newBio : null,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsername(response.data.username);
            setNewBio(response.data.bio);
            if (field === 'username') {
                setIsEditingUsername(false);
                setShowUsernameUpdateButton(false);
            } else if (field === 'bio') {
                setIsEditingBio(false);
                setShowBioUpdateButton(false);
            }
        } catch (error) {
          console.log('Failed to update');
        }
    };

    
    // Profile pic code

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    const handleUpload = async (e) => {
        e.preventDefault(); 
    
        try {
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                console.error('No token found');
                toast.info('Please log in to upload a profile image.');
                return;
            }
    
            if (!selectedFile) {
                toast.info('Please select a file to upload.');
                return;
            }
    
            const formData = new FormData();
            formData.append('file', selectedFile);
    
            await axios.post('http://localhost:8000/api/profile-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
    
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error('There was an error uploading your profile image!');
            console.error('Error uploading file:', error);
        }
    };    

    
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:8000/api/user-posts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserPosts();
    }, []);

    const [profilePrpChangeVisible, setProfilePrpChangeVisible] = useState(false);
    const handleProfileClick = () => {
        setProfilePrpChangeVisible(!profilePrpChangeVisible); 
    };

    return(
        <div className="profile">
            <ToastContainer/>
            <div className="profile-details p-4 py-5 br tr bs d-flex flex-column align-items-center"
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <div className='profile-details-inner px-1 extra-gap'>

                    <div className='profile-prp' onClick={handleProfileClick}>
                        {profilePic ? (
                            <img
                                className='prp-image'
                                src={profilePic}
                                alt="Profile"
                            />
                        ) : (
                            <i className="p-1 fa-solid fa-user prp-image"></i>
                        )}

                        <div className="prp-overlay">
                            <i className="fa-solid fa-edit edit-icon"></i>
                        </div>
                    </div>

                    <div className='profile-details-part px-1'>

                        <div className='username-div pt-2 d-flex gap align-items-center'>
                            {!isEditingUsername && (
                                <div className='username-edit-icon' onClick={() => handleEditClick('username')}>
                                    <i className="fa-solid fa-edit" style={{ cursor: 'pointer' }}></i>
                                </div>
                            )}
                            <input 
                                style={{ color: colors.Text, backgroundColor: colors.Highlight }}
                                className='text-lg bold'
                                type="text"
                                value={newUsername} 
                                onChange={(e) => setNewUsername(e.target.value)} 
                                readOnly={!isEditingUsername}
                            />
                            {showUsernameUpdateButton && (
                                <button className='normal-btn' onClick={() => handleUpdate('username')}>
                                    Update
                                </button>
                            )}
                        </div>

                        <div className='profile-info py-2 pt-3 extra-gap'>
                            <span className='text-sm'>{posts.length} posts</span>
                            <span className='text-sm'>{followers} followers</span>
                            <span className='text-sm'>{following.length} following</span>
                        </div>

                        <div>
                            <p className='m-0 text-lg bold pt-3 pb-2'>{firstName} {lastName}</p>
                            <div className='bio-textarea-div pt-1'>
                                {!isEditingBio && (
                                    <div className='username-edit-icon' onClick={() => handleEditClick('bio')}>
                                        <i className="fa-solid fa-edit" style={{ cursor: 'pointer' }}></i>
                                    </div>
                                )}
                                <textarea
                                    style={{ color: colors.Text, backgroundColor: colors.Highlight }}
                                    className='text-sm pt-2 br'
                                    value={newBio}
                                    onChange={(e) => setNewBio(e.target.value)}
                                    readOnly={!isEditingBio}
                                />
                                {showBioUpdateButton && (
                                    <button className='normal-btn d-block mt-1' onClick={() => handleUpdate('bio')}>
                                        Update
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                    {profilePrpChangeVisible && (
                    <div className='pt-3 br p-3' style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
                        <p className="pb-2 m-0 text-sm bold">Upload profile image</p>
                        <div className='d-flex align-items-center'>
                            <div>
                                <input
                                    type="file"
                                    className='profile-pic-upload-input'
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button className='normal-btn' onClick={handleUpload}>Upload</button>
                        </div>
                    </div>
                    )}
            </div>

            <div className="profile-media tr bs p-4 pt-5 mt-4 mb-3 br"
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
                        <p>No posts available</p>
                    )}
                </div>
            </div>

            <div className="profile-media tr bs p-4 pt-5 mt-4 mb-3 br"
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
                        <p>No posts available</p>
                    )}
                </div>
                

                
            </div>
        </div>
    )
}

export default Profile; 