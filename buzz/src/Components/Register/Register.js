import './Register.css'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register({colors}){
    const navigate = useNavigate();
    const handleLoginClick = () => {
        // setFadeOut(true);
        setTimeout(() => {
            navigate('/login');
        }, 0); 
    };

    // Backend request

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
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
            const response = await axios.post('https://buzz-backend-pied.vercel.app/api/register', formData); 
            toast.success('Account created. Please log in');
            console.log('User created:', response.data);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error('Error registering your account!');
            console.error('Error creating user:', error);
        }
    };


    return(
        <div className="register d-flex align-items-center justify-content-center"
        style={{color: colors.Text, backgroundColor: colors.Background}}>
            <ToastContainer/>
            <div className='register-inner br p-5'
            style={{color: colors.Text, backgroundColor: colors.Highlight}}
            >
                <p className="text-lg text-center">Register</p>
                <form className='settings-inputs pt-1' onSubmit={handleSubmit}>
                    <div className='d-flex gap justify-content-between py-2'>
                        <div className='py-2 settings-input-div'>
                            <p className="text-esm-red m-0 pb-2">First name</p>
                            <input
                                className='text-sm settings-input br px-2 py-2'
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={formData.firstName}
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
                                value={formData.lastName}
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
                                value={formData.username }
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
                                value={formData.email}
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
                                value={formData.password}
                                onChange={handleChange}
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                            />
                        </div>
                    </div>
                    
                    <div className="text-center pt-4 pb-1">
                        <button type="submit" className="mx-1 add-item-btn my-1 p-2 px-3 normal-btn">Create account</button>
                    </div>
                    <p className="text-sm m-0 text-center pt-2">Already a user?<span onClick={handleLoginClick} className="link-orange"> Log in</span></p>
                </form>
            </div>
        </div>
    )
}

export default Register; 
