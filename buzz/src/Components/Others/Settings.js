// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Settings.css'

// function Settings({colors, updateFeed, fetchUserData, userData, setUserData, handleChange}){
    

//     return(
//         <div className="settings br p-4"
//         style={{color: colors.Text, backgroundColor: colors.Highlight}}
//         >
//             <ToastContainer />
//             <div className="profile-content">
//                     <p className="text-lg text-center">Account settings</p>
                    
//                     <form className='settings-inputs pt-1' onSubmit={handleSubmit}>
//                         <div className='d-flex gap justify-content-between py-2'>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">First name</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="First Name"
//                                     name="firstName"
//                                     value={userData.firstName || ''}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">Last name</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="Last Name"
//                                     name="lastName"
//                                     value={userData.lastName || ''}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                         </div>
//                         <div className='d-flex gap justify-content-between py-2'>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">Username</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="Username"
//                                     name="username"
//                                     value={userData.username || ''}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">Email</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="Email"
//                                     name="email"
//                                     value={userData.email || ''}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                         </div>
//                         <div className='gap py-2'>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">Password</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="Password"
//                                     name="password"
//                                     value={userData.password || ''}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                         </div>
//                         <div className='d-flex gap justify-content-between py-2'>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">Location</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="Location"
//                                     name="location"
//                                     value={userData.location || ''}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                             <div className='py-2 settings-input-div'>
//                                 <p className="text-esm-red m-0 pb-2">Work company</p>
//                                 <input
//                                     className='text-sm settings-input br px-2 py-2'
//                                     type="text"
//                                     placeholder="Company"
//                                     name="workCompany"
//                                     value={userData.workCompany}
//                                     onChange={handleChange}
//                                     style={{color: colors.Text, backgroundColor: colors.Input}}
//                                 />
//                             </div>
//                         </div>
                        
//                         <div className="text-center pt-4 pb-1">
//                             <button type="submit" className="mx-1 add-item-btn my-1 p-2 px-3 normal-btn">Save changes</button>
//                         </div>
//                     </form>
//             </div>
//         </div>
//     )
// }

// export default Settings;