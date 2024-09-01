import './Saved.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Saved({colors, setIsLoading}){
    const navigate = useNavigate();
    const handleProfileClick = (username) => {
        setIsLoading(true);

        setTimeout(() => {
        setIsLoading(false); 
        navigate(`/profile/${username}`);
        }, 500);
    };

    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const authToken = localStorage.getItem('authToken');  // Get the auth token

                const response = await axios.get(
                    'http://localhost:8000/api/saved-posts',
                    { headers: { Authorization: `Bearer ${authToken}` } }  // Attach token to request
                );

                setSavedPosts(response.data);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            }
        };

        fetchSavedPosts();
    }, []);
    return(
        <div className="saved-page max-home-content">
            <div className='saved-inner br bs pt-3'
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <p className='m-0 text-esm-red pb-1 pt-2 text-center'>Saved</p>
                <div className='explore-inner-posts br p-3 py-4 bs tr'
                style={{color: colors.Text, backgroundColor: colors.Highlight}}>

                    <div className="profile-media px-4 pb-3 br"
                    style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                        <div className='profile-posts row pt-2'>
                            {savedPosts.length > 0 ? (
                                savedPosts
                                    .filter(post => post.post.image) 
                                    .slice().reverse()
                                    .map((post, index) => (
                                        <div key={index} className='profile-post col-12 col-sm-6 col-lg-4 col-md-4 py-2'>
                                            <div className='profile-post-image-wrapper'>
                                                <img src={post.post.image} className='br-top'/>
                                                <p className='profile-post-caption m-0 text-esm'>{post.post.caption}</p>
                                            </div>
                                            <div className='br-bottom py-3 px-3' style={{color: colors.Text, backgroundColor: colors.Input}}>
                                                <div className='d-flex gap align-items-center'>
                                                    <div onClick={() => handleProfileClick(post.user.username)} className='pointer profile-pic-div user-profile-div d-flex justify-content-center align-items-center'>
                                                            <img className='' src={post.user.profileImage} />
                                                    </div>
                                                    <div>
                                                        <p onClick={() => handleProfileClick(post.user.username)} className='m-0 profile-heading bold'>{post.user.firstName} {post.user.lastName}</p>
                                                        <p className='m-0 text-esm'>@{post.user.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p>No posts available</p>
                            )}
                        </div>
                    </div>

                    <hr className='mx-5'/>

                    <div className="profile-media px-4 pt-2 br"
                    style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                        <div className='profile-text-posts row pt-2 px-2'>
                            {savedPosts.length > 0 ? (
                                savedPosts
                                    .filter(post => !post.post.image) 
                                    .slice().reverse()
                                    .map((post, index) => (
                                        <div key={index} className='text-only-post col-12 col-sm-6 col-lg-4 px-2 py-2'>
                                            <div className='br-top px-3 py-3 text-only-post-inner' style={{color: colors.Text, backgroundColor: colors.Input}}>
                                                <p className='m-0 text-only-caption text-sm'>{post.post.caption}</p>
                                            </div>

                                            <hr className='m-0'/>

                                            <div className='br-bottom px-3 py-3' style={{color: colors.Text, backgroundColor: colors.Input}}>
                                                <div className='d-flex gap align-items-center'>
                                                    <div onClick={() => handleProfileClick(post.user.username)} className='pointer profile-pic-div user-profile-div d-flex justify-content-center align-items-center'>
                                                            <img className='' src={post.user.profileImage} />
                                                    </div>
                                                    <div>
                                                        <p onClick={() => handleProfileClick(post.user.username)} className='m-0 profile-heading bold'>{post.user.firstName} {post.user.lastName}</p>
                                                        <p className='m-0 text-esm'>@{post.user.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p>No posts available</p>
                            )}
                        </div>
                        

                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Saved; 