import React, { useState, useEffect } from 'react';
import './Explore.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Explore({colors, setIsLoading, users, posts, toggleFollow, userFollowStatuses}){
    const navigate = useNavigate();
    const handleProfileClick = (username) => {
        setIsLoading(true);

        setTimeout(() => {
        setIsLoading(false); 
        navigate(`/profile/${username}`);
        }, 500);
    };

    return(
        <div className="explore max-home-content">
            <div className='explore-row d-flex justify-content-between extra-gap'>
                <div className='explore-inner px-3 py-3 br bs tr'
                style={{color: colors.Text, backgroundColor: colors.Highlight}}
                >
                    <p className='m-0 text-esm-red pb-1 pt-2'>Explore</p>
                    {users.map(user => (
                        <div key={user._id} className='d-flex justify-content-between py-3 align-items-center'>
                            <div className='d-flex gap align-items-center'>
                                <div onClick={() => handleProfileClick(user.username)} className='pointer profile-pic-div user-profile-div d-flex justify-content-center align-items-center'>
                                    {user.profileImage ? (
                                        <img className='' src={user.profileImage} />
                                    ) : (
                                        <i className="p-1 fa-solid fa-user user-icon user-icon"></i>
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
                </div>

                <div className='explore-inner-posts br p-3 py-4 bs tr'
                style={{color: colors.Text, backgroundColor: colors.Highlight}}>

                    <div className="profile-media px-4 pb-3 br"
                    style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                        <div className='profile-posts row pt-2'>
                            {posts.length > 0 ? (
                                posts
                                    .filter(post => post.image) // Filter out posts without a valid image
                                    .slice().reverse()
                                    .map((post, index) => (
                                        <div key={index} className='profile-post col-12 col-sm-6 col-lg-4 col-md-4 py-2'>
                                            <div className='profile-post-image-wrapper'>
                                                <img src={post.image} className='br-top'/>
                                                <p className='profile-post-caption m-0 text-esm'>{post.caption}</p>
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
                            {posts.length > 0 ? (
                                posts
                                    .filter(post => !post.image) 
                                    .slice().reverse()
                                    .map((post, index) => (
                                        <div key={index} className='text-only-post col-12 col-sm-6 col-lg-4 px-2 py-2'>
                                            <div className='br-top px-3 py-3 text-only-post-inner' style={{color: colors.Text, backgroundColor: colors.Input}}>
                                                <p className='m-0 text-only-caption text-sm'>{post.caption}</p>
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

export default Explore;
