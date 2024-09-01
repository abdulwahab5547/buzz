import './Register.css'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({colors, setIsLoggedIn}){
    const navigate = useNavigate();
    const handleRegisterClick = () => {
        navigate('/register'); 
    };

    // Login functions

    const [formData, setFormData] = useState({
        email: '',
        username: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            if (response.data.token) {
                // Save token to localStorage
                localStorage.setItem('authToken', response.data.token);

                // setIsLoggedIn(true);

                // Show success message
                toast.success("You've successfully logged in!");
                setIsLoggedIn(true);
    
                // Log success for debugging
                console.log('Logged in:', response.data);

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                throw new Error('Token not received from server');
            }
        } catch (error) {
            toast.error('There was an error logging into your account!');
            console.error('Error logging in:', error);
        }
    };

    return(
        <div className="register d-flex align-items-center justify-content-center"
        style={{color: colors.Text, backgroundColor: colors.Background}}>
            <ToastContainer/>
            <div className='register-inner br p-4 px-4'
            style={{color: colors.Text, backgroundColor: colors.Highlight}}
            >
                <p className="text-lg text-center">Log in</p>
                <form className='settings-inputs pt-1' onSubmit={handleSubmit}>
                    <div className='py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Username</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.firstName}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    <div className='py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">Password</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="Password"
                                name="password"
                                value={formData.firstName}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    
                    <div className="text-center pt-4 pb-1">
                        <button type="submit" className="mx-1 add-item-btn my-1 p-2 px-3 normal-btn">Log in</button>
                    </div>
                    <p className="text-sm m-0 text-center pt-2">Not a user?<span onClick={handleRegisterClick} className="link-orange"> Sign up</span></p>
                </form>
            </div>
        </div>
    )
}

export default Login; 
