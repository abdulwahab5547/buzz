import './Home.css'
import Overlay from '../Overlay/Overlay'
import Search from '../Others/Search'
import Feed from './Feed'
import Profile from './Profile'
import UserProfile from './UserProfile'
import Settings from './Settings'
import Messages from './Messages'
import ReelsPage from './ReelsPage'
import Saved from './Saved'
import Liked from './Liked'
import Loading from './Loading'
import Explore from './Explore'
import Notifications from './Notifications'
import { Routes, Route, Outlet, useNavigate} from 'react-router-dom';

import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import Logo from '../../assets/logo.png'
import React, { useState, useEffect } from 'react';

function Home({colors, toggleTheme, isLoggedIn, setIsLoggedIn}){

    // Logout

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        setIsLoggedIn(false);
        setTimeout(() => {
          navigate('/start');
      }, 500);
    };

    // Loading part
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const handleNavigation = (route) => {
        setIsLoading(true);
    
        setTimeout(() => {
            setIsLoading(false);
            navigate(route);
        }, 500);
    };
    const handleHome = () => handleNavigation('/');
    const handleSaved = () => handleNavigation('/saved');
    const handleLiked = () => handleNavigation('/liked');
    const handleReels = () => handleNavigation('/reels');
    const handleMessages = () => handleNavigation('/messages');
    const handleNotifications = () => handleNavigation('/notifications');
    const handleProfile = () => handleNavigation('/profile');
    const handleExplore = () => handleNavigation('/explore');
    // const handleLogoutRoute = () => handleNavigation('/start');
    
    // Overlay

    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [overlayContent, setOverlayContent] = useState(null);

    const toggleOverlay = (content) => {
        setOverlayContent(content);
        setIsOverlayVisible(prev => !prev);
    };

    const handleCancelClick = () => {
        setIsOverlayVisible(false);
    };

    // Dropdown

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleDropdownToggle = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    // Notification dropdown

    const [isNotificationVisible, setNotificationVisible] = useState(false);

    const handleNotificationToggle = () => {
        setNotificationVisible(!isNotificationVisible);
    };

    // explore users part

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        fetch('https://buzz-backend-pied.vercel.app/api/all-users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // Fetch posts part

    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://buzz-backend-pied.vercel.app/api/new-post');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error.response ? error.response.data : error.message);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, []);
    const [savedPosts, setSavedPosts] = useState([]);
    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const authToken = localStorage.getItem('authToken'); 

                const response = await axios.get(
                    'https://buzz-backend-pied.vercel.app/api/saved-posts',
                    { headers: { Authorization: `Bearer ${authToken}` } } 
                );

                setSavedPosts(response.data);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            }
        };
    }, []);

    // Logged in user part
    const [userName, setUserName] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('https://buzz-backend-pied.vercel.app/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserName(response.data.firstName);
            } catch (error) {
                console.log('Failed to fetch user data');
            }
        };
        fetchUserData();
    }, []);

    // Search visible

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const handleSearchClick = () => {
        setIsSearchVisible(true);
    };
    const handleCloseClick = () => {
        setIsSearchVisible(false); 
    };

    // Notifications

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await axios.get('https://buzz-backend-pied.vercel.app/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setNotifications(response.data);
                
            } catch (err) {
                console.error('Error fetching notifications:', err.response ? err.response.data : err.message);
            }
        };

        fetchNotifications();
    }, []);

    // Follow

    const [userFollowStatuses, setUserFollowStatuses] = useState({});
    useEffect(() => {
        const checkAllFollowStatuses = async () => {
            const token = localStorage.getItem('authToken');
            const updatedStatuses = {};

            try {
                for (let user of users) {
                    const response = await axios.get(`https://buzz-backend-pied.vercel.app/api/check-follow/${user._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    updatedStatuses[user._id] = response.data.isFollowing;
                }
                setUserFollowStatuses(updatedStatuses);
            } catch (error) {
                console.error('Error checking follow statuses:', error);
            }
        };

        checkAllFollowStatuses();
    }, [users]);
    
    const toggleFollow = async (targetUserId) => {
        // Optimistically update the follow status in the UI
        setUserFollowStatuses(prevStatuses => {
            const originalStatus = prevStatuses[targetUserId];
            return {
                ...prevStatuses,
                [targetUserId]: !originalStatus
            };
        });
    
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('https://buzz-backend-pied.vercel.app/api/follow', { targetUserId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        } catch (error) {
            // Revert the follow status in the UI if the request fails
            setUserFollowStatuses(prevStatuses => ({
                ...prevStatuses,
                [targetUserId]: !prevStatuses[targetUserId] // Revert to the original status
            }));
            console.error('Error following/unfollowing user:', error);
        }
    };


    return(
        <div className='main-div'
        >
            {/* Navbar */}
            <div className='nav-bg bs tr'
            style={{color: colors.Text, backgroundColor: colors.Highlight}}
            >
                <div className='nav-container-phone py-2 max-home-content'>
                    <div className='nav-phone d-flex justify-content-between align-items-center py-1'>
                        <div className='nav-phone-left'>
                            <div className='buzz-logo-phone pointer' onClick={handleHome}>
                                <img src={Logo}/>
                            </div>
                        </div>
                        <div className='nav-phone-right'>
                            <div className='light-dark-mode-icon icon-div hover-icon'
                            onClick={handleDropdownToggle}
                            > 
                                <i className="fa-solid fa-bars p-2"></i>
                            </div>
                        </div>
                        {isDropdownVisible && (
                            <div className='nav-phone-dropdown pt-3 br px-1 py-2 pointer'
                            style={{ color: colors.Text, backgroundColor: colors.Highlight}}
                            >
                                <div className='max-home-content'>
                                    <div className='search-bar py-3'>
                                        <input
                                            type="text"
                                            // value='Search'
                                            placeholder="Search..."
                                            className="nav-search-input py-1 px-2"
                                            style={{ color: colors.Text, backgroundColor: colors.Input}}
                                            // autoFocus
                                        />
                                    </div>
                                    <div className='nav-phone-icons d-flex gap pb-1 py-4 justify-content-between'>
                                        <div className='light-dark-mode-icon icon-div hover-icon'
                                        onClick={handleHome}> 
                                            <i className="fa-solid fa-home p-2"></i>
                                        </div>
                                        <div className='light-dark-mode-icon icon-div hover-icon'
                                        onClick={handleExplore}> 
                                            <i class="fa-solid fa-users"></i>
                                        </div>
                                        
                                        <div className='light-dark-mode-icon icon-div hover-icon'
                                        onClick={toggleTheme}> 
                                            <i className="fa-solid fa-lightbulb p-2"></i>
                                        </div>
                                        <div className='notification-icon-div'>
                                            <div className='light-dark-mode-icon icon-div hover-icon' 
                                                onClick={handleNotificationToggle}> 
                                                <i className="fa-solid fa-bell p-2"></i>    
                                            </div>
                                            {isNotificationVisible && (
                                                <div className='notification-dropdown bs br px-1 py-2 pointer'
                                                style={{ color: colors.Text, backgroundColor: colors.Input}}
                                                >
                                                    Some
                                                </div>
                                            )}
                                        </div>
                                        <div className='light-dark-mode-icon icon-div hover-icon'
                                            onClick={handleMessages}
                                            > 
                                            <i className="fa-solid fa-message p-2"></i>
                                        </div>
                                    </div>
                                    <hr className='p-0 my-3 mt-4'/>
                                    <span onClick={handleProfile} className='text-sm py-3'>Profile</span>
                                    <hr className='p-0 my-3 mt-4'/>
                                    <span className='text-sm pt-3'>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='nav-container max-home-content py-2'>
                    <div className='navbar d-flex justify-content-between'>
                        <div className='nav-left d-flex align-items-center more-gap'>
                            <div className='buzz-logo pointer' onClick={handleHome}>
                                <img src={Logo}/>
                            </div>
                            <div className='search-bar' onClick={handleSearchClick}>
                                <input
                                    type="text"
                                    // value='Search'
                                    placeholder="Search..."
                                    className="nav-search-input py-1 px-2"
                                    style={{ color: colors.Text, backgroundColor: colors.Input}}
                                    // autoFocus
                                />
                            </div>
                        </div>
                        <div className='nav-right d-flex align-items-center more-gap'>
                            <div className='nav-icons-div d-flex more-gap px-3'>
                                <div className='light-dark-mode-icon icon-div hover-icon'
                                
                                onClick={handleHome}> 
                                    <i className="fa-solid fa-home p-2"></i>
                                </div>
                                <div className='light-dark-mode-icon icon-div hover-icon'
                                    onClick={handleReels}> 
                                    <i class="fa-solid fa-video p-2"></i>
                                </div>
                                <div className='light-dark-mode-icon icon-div hover-icon'
                                onClick={handleExplore}> 
                                    <i class="fa-solid fa-users p-2"></i>
                                </div>
                                <div className='light-dark-mode-icon icon-div hover-icon'
                                onClick={toggleTheme}> 
                                    <i className="fa-solid fa-lightbulb p-2"></i>
                                </div>
                                <div className='notification-icon-div'>
                                    <div className='light-dark-mode-icon icon-div hover-icon' 
                                        onClick={handleNotificationToggle}> 
                                        <i className="fa-solid fa-bell p-2"></i>    
                                    </div>
                                    {isNotificationVisible && (
                                        <div className='notification-dropdown bs br py-2 px-2'
                                        style={{ color: colors.Text, backgroundColor: colors.Input}}
                                        >
                                            <p className='m-0 text-esm-red pb-1 pt-2 px-1'>Notifications</p>
                                            <div className='notifications'>
                                                {notifications.slice(0, 3).map(notification => (
                                                    <div className='my-2 br px-2 py-1'
                                                    style={{ color: colors.Text, backgroundColor: colors.Highlight}}>
                                                        <li key={notification._id}>
                                                            <p className='m-0 text-sm'>{notification.message}</p>
                                                            <small className='text-esm'>{new Date(notification.createdAt).toLocaleString()}</small>
                                                        </li>
                                                    </div>
                                                ))}
                                            </div> 
                                            <p onClick={handleNotifications} className='text-esm-red pt-3 px-1'>Show all...</p>
                                            
                                        </div>
                                    )}
                                </div>
                                
                                <div className='light-dark-mode-icon icon-div hover-icon'
                                onClick={handleMessages}
                                > 
                                    <i className="fa-solid fa-message p-2"></i>
                                </div>
                                
                            </div>
                            <div className='nav-dropdown-div'>
                                <button className="dropdown-button br px-2 py-2 pointer"
                                style={{ color: colors.Text, backgroundColor: colors.Input}}
                                onClick={handleDropdownToggle}
                                >
                                    <span className='px-3 text-sm'>{userName}</span>
                                    <span className='px-1'><i class="fa-solid fa-caret-down"></i></span>
                                </button>
                                {isDropdownVisible && (
                                    <div className='logout-dropdown bs br px-1 py-2 pointer d-flex flex-column'
                                    style={{ color: colors.Text, backgroundColor: colors.Input}}
                                    >
                                        <span onClick={handleProfile} className='text-sm py-2 px-4 pointer'>Profile</span>
                                        <hr className='p-0 m-0'/>
                                        <span onClick={handleLiked} className='text-sm py-2 px-4 pointer'>Liked</span>
                                        <hr className='p-0 m-0'/>
                                        <span onClick={handleSaved} className='text-sm py-2 px-4 pointer'>Saved</span>
                                        <hr className='p-0 m-0'/>
                                        <span onClick={handleLogout} className='text-sm py-2 px-4 pointer'>Logout</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {isSearchVisible && <Search users={users} colors={colors} handleCloseClick={handleCloseClick} setIsLoading={setIsLoading}/>}

            

            {isLoading && <Loading />}

            <Routes>
                <Route path="/" element={<Feed colors={colors} toggleOverlay={toggleOverlay} handleCancelClick={handleCancelClick} setIsLoading={setIsLoading} handleExplore={handleExplore} users={users} posts={posts} setPosts={setPosts} savedPosts={savedPosts} toggleFollow={toggleFollow} userFollowStatuses={userFollowStatuses} fetchPosts={fetchPosts}/>} />
                <Route path="profile" element={<Profile colors={colors} />} />
                <Route path="profile/:username" element={<UserProfile colors={colors} handleMessages={handleMessages} />} />
                <Route path="messages" element={<Messages colors={colors} users={users} />} />
                <Route path="settings" element={<Settings colors={colors} />} />
                <Route path="explore" element={<Explore colors={colors} setIsLoading={setIsLoading} users={users} posts={posts} toggleFollow={toggleFollow} userFollowStatuses={userFollowStatuses} />} />
                <Route path="reels" element={<ReelsPage colors={colors} />} />
                <Route path="notifications" element={<Notifications colors={colors} notifications={notifications} />} />
                <Route path="saved" element={<Saved colors={colors} setIsLoading={setIsLoading} />} />
                <Route path="liked" element={<Liked colors={colors} setIsLoading={setIsLoading} />} />
            </Routes>
            <Outlet />
            
            
            
            <Overlay isVisible={isOverlayVisible} onClose={() => setIsOverlayVisible(false)} colors={colors}>
                {overlayContent}
            </Overlay>
        </div>
    )
}

export default Home;
