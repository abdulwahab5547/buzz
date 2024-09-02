import './Messages.css'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Messages({colors, users}) {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState({
        profileImage: '',
        firstName: '',
        lastName: '',
        username: ''
    });

    const handleUserClick = (user) => {
        setSelectedUserId(user._id);
        setSelectedUser({
            profileImage: user.profileImage,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    };

    const [searchQuery, setSearchQuery] = useState('');
    const filteredUsers = users
        .filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
            const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
            const query = searchQuery.toLowerCase();
            const aStartsWith = aName.startsWith(query);
            const bStartsWith = bName.startsWith(query);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return 0;
        });

    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('https://buzz-backend-pied.vercel.app/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Assuming the user ID is stored in `response.data._id`
                setLoggedInUserId(response.data._id);
            } catch (error) {
                console.log('Failed to fetch user data');
            }
        };
        fetchUserData();
    }, []);

    // Messages

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (selectedUserId) {
            // Fetch messages when a user is selected
            axios.get(`https://buzz-backend-pied.vercel.app/api/messages/${loggedInUserId}/${selectedUserId}`)
                .then(res => setMessages(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedUserId]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                console.error('No token found');
                return;
            }
    
            axios.post('https://buzz-backend-pied.vercel.app/api/messages', {
                senderId: loggedInUserId,
                receiverId: selectedUserId,
                content: newMessage,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include the token in the request headers
                }
            }).then(res => {
                setMessages([...messages, res.data]); // Add new message to the list
                setNewMessage(''); // Clear the input
            }).catch(err => console.error(err));
        }
    };
    

    // Scroll bottom

    const messageContainerRef = useRef(null);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Search feature

    return (
        <div className="messages max-message-content d-flex align-items-center">
            <div className='messages-container d-flex gap'>
                <div className='message-users br bs tr py-3 px-2 d-flex flex-column mx-1'
                    style={{color: colors.Text, backgroundColor: colors.Highlight}}
                >
                    <div className='message-search-user py-3 pb-4 px-2'>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search chats..."
                            className="nav-search-input py-2 px-2 br text-sm"
                            style={{ color: colors.Text, backgroundColor: colors.Input}}
                        />
                    </div>
                    {filteredUsers.map(user => (
                        <div key={user._id} className={`hover-icon px-3 d-flex justify-content-between py-2 my-1 align-items-center ${selectedUserId === user._id ? 'active' : ''}`}
                            onClick={() => handleUserClick(user)}
                        >
                            <div className='d-flex gap align-items-center'>
                                <div className='pointer profile-pic-div user-profile-div d-flex justify-content-center align-items-center'>
                                    {user.profileImage ? (
                                        <img className='' src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                                    ) : (
                                        <i className="p-1 fa-solid fa-user user-icon user-icon"></i>
                                    )}
                                </div>

                                <div>
                                    <p className='m-0 bold'>{user.firstName} {user.lastName}</p>
                                    <p className='m-0 text-esm'>@{user.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='message-interface br bs tr d-flex flex-column justify-content-between'
                    style={{color: colors.Text, backgroundColor: colors.Highlight}}
                >
                    <div className='message-interface-top mt-3 mx-2 br p-3 px-4 d-flex gap align-items-center'
                        style={{color: colors.Text, backgroundColor: colors.Background}}
                    >
                        {selectedUser.firstName ? (
                            <div className='profile-info'>
                                <div className='profile-pic-div'>
                                    {selectedUser.profileImage ? (
                                        <img className='selected-user-image' src={selectedUser.profileImage} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
                                    ) : (
                                        <i className="p-3 fa-solid fa-user user-icon user-icon"></i>
                                    )}
                                </div>
                                <div className='mx-2'>
                                    <p className='m-0 bold'>{selectedUser.firstName} {selectedUser.lastName}</p>
                                    <p className='m-0 text-esm'>@{selectedUser.username}</p>
                                </div>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    <div className='message-list py-3 mt-2 mx-3' ref={messageContainerRef}>
                        <div className='message-container px-4'>
                            {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.senderId === loggedInUserId ? 'sent' : 'received'}`}>
                                <div className='message-content-div my-3 br px-3 py-2 d-flex justify-content-between align-items-center'
                                style={{color: colors.Text, backgroundColor: colors.Input}}
                                >
                                    <p className='br m-0 text-sm'>
                                        {msg.content}
                                    </p>
                                    <span className='text-esm-red'>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>


                    <div className='message-input-div gap pb-4'>
                        <textarea
                            placeholder="Your message..."
                            className="py-3 px-3 post-input"
                            style={{ color: colors.Text, backgroundColor: colors.Input }}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); 
                                    handleSendMessage();
                                }
                            }}
                            autoFocus
                        />
                        <div onClick={handleSendMessage}
                        className='submit-buzzai pointer d-flex align-items-center justify-content-center'
                        >
                            <i class="fa-solid fa-arrow-up"></i>   
                        </div>
                    </div>
                            
                </div>
            </div>
        </div>
    );
}

export default Messages;
