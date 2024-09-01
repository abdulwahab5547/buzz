// Search.js
import React, { useState } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';

function Search({colors, users, handleCloseClick, setIsLoading}) {
    
    const [searchQuery, setSearchQuery] = useState('');
    const filteredUsers = Array.isArray(users) ? users
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
        }) : [];

    const navigate = useNavigate();
    const handleProfileClick = (username) => {
        setIsLoading(true);

        setTimeout(() => {
        setIsLoading(false); 
        navigate(`/profile/${username}`);
        }, 500);
    };
    return (
        <div className='search max-home-content'>
        <div className="search-overlay br p-4"
        style={{color: colors.Text, backgroundColor: colors.Highlight}}>
            <div className="search-container">
            
                <div className='d-flex justify-content-center'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="search-input py-2 px-3"
                        style={{color: colors.Text, backgroundColor: colors.Input}}
                        autoFocus
                    />
                </div>
                
                <div className="search-results pt-4 px-2">
                    {filteredUsers.slice(0, 3).map(user => (
                        <div key={user._id} className={`hover-icon px-3 d-flex justify-content-between py-2 my-1 align-items-center`}>
                            <div className='d-flex gap align-items-center'>
                                <div onClick={() => handleProfileClick(user.username)} className='pointer profile-pic-div user-profile-div d-flex justify-content-center align-items-center'>
                                    {user.profileImage ? (
                                        <img className='' src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                                    ) : (
                                        <i className="p-1 fa-solid fa-user user-icon user-icon"></i>
                                    )}
                                </div>

                                <div>
                                    <p onClick={() => handleProfileClick(user.username)} className='m-0 bold'>{user.firstName} {user.lastName}</p>
                                    <p className='m-0 text-esm'>@{user.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='search-close'>
                <div className='light-dark-mode-icon icon-div hover-icon d-inline p-1'
                onClick={handleCloseClick}> 
                    <i className="fa-solid fa-xmark p-2"></i>
                </div>                       
            </div>
        </div>
        </div>
    );
}

export default Search;