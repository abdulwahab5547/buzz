import './BuzzAI.css';
import Logo from '../../assets/logo.png';
import React, { useState } from 'react';
import axios from 'axios';

function BuzzAI({ colors }) {
    const [showLogo, setShowLogo] = useState(true);
    const [animateLogo, setAnimateLogo] = useState(false);

    const handleLogoClick = () => {
        setAnimateLogo(true);
        setTimeout(() => {
            setShowLogo(false);
        }, 1000);
    };

    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setLoading(true);
        try {
            const result = await axios.post('http://localhost:8000/api/buzzai', { message });
            setResponse(result.data.response);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setResponse('Sorry, there was an error processing your request.');
        }
        setLoading(false);
        setMessage('');
    };

    return (
        <div className="buzzai">
            
            <div
                className="buzzai-inner bs br p-4 d-flex align-items-center justify-content-center"
                style={{ color: colors.Text, backgroundColor: colors.Highlight }}
            >
                {showLogo ? (
                    <div
                        className={`buzzai-logo bs pointer text-center br p-4 ${animateLogo ? 'animate' : ''}`}
                        onClick={handleLogoClick}
                        style={{ color: colors.Text, backgroundColor: colors.Background}}
                    >
                        <img src={Logo} className='br' />
                        <p className='m-0 text-esm-red pb-1 pt-2'>BuzzAI</p>
                        <p className='text-esm pt-3 m-0'>Tap on me to chat with BuzzAI</p>
                    </div>
                ) : (
                    <div className='buzzai-text justify-content-between'>
                        <div className='buzzai-response-div px-2'>
                            {loading ? <p className='text-sm'>Loading...</p> : <p className='text-sm'>{response || 'Start chatting...'}</p>}
                        </div>
                        <div className='buzzai-input-div gap pb-3'>
                            <textarea
                                placeholder="Enter your prompt..."
                                className="py-3 px-3 post-input"
                                style={{ color: colors.Text, backgroundColor: colors.Input }}
                                value={message}
                                onChange={handleInputChange}
                                autoFocus
                            />
                            <div className='submit-buzzai pointer d-flex align-items-center justify-content-center' onClick={handleSubmit}>
                                <i class="fa-solid fa-arrow-up"></i>   
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BuzzAI;
