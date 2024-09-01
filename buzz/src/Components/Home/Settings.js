import './Settings.css'

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Settings({colors}){
    // Fetch user data

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

        const response = await axios.get('https://buzz-backend-pied.vercel.app/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('User data response:', response.data);

        setUserData(response.data);

        // if (updateFeed) {
        //     updateFeed(response.data);
        // }

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
    

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted');
        try {
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                console.error('No token found');
                toast.info('Please log in to use all features.');
                return;
            }
    
            const response = await axios.put('https://buzz-backend-pied.vercel.app/api/user', userData, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });

        // If the update was successful, call updateFeed with the updated user data
            // if (updateFeed) {
            //     updateFeed(userData);
            // }
    
            toast.success('Changes saved!');
        } catch (error) {
            toast.error('There was an error updating your account details!');
            console.error('Error updating user data:', error);
        }
    };


    return(
        <div className="settings">
            <ToastContainer />
            <div className='settings-inner br p-4 py-5' style={{color: colors.Text, backgroundColor: colors.Highlight}}>
            <div className="profile-content">
                <p className="text-lg text-center">Account settings</p>
                
                <form className='settings-inputs pt-1' onSubmit={handleSubmit}>
                    <div className='d-flex gap justify-content-between py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">First name</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Last name</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    <div className='d-flex gap justify-content-between py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Username</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={userData.username || ''}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Email</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={userData.email || ''}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    <div className='gap py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Password</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Password"
                                name="password"
                                value={userData.password || ''}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    <div className='d-flex gap justify-content-between py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Location</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Location"
                                name="location"
                                value={userData.location || ''}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Work company</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Company"
                                name="workCompany"
                                value={userData.workCompany}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    <div className='d-flex gap justify-content-between py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Twitter</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Twitter URL"
                                name="twitter"
                                value={userData.twitter}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Instagram</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Instagram URL"
                                name="instagram"
                                value={userData.instagram}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    
                    <div className="text-center pt-4 pb-1">
                        <button type="submit" className="mx-1 add-item-btn my-1 p-2 px-3 normal-btn">Save changes</button>
                    </div>
                </form>
            </div>
            </div>
            
        </div>
    )
}

export default Settings; 
