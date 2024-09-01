import { useNavigate } from 'react-router-dom';
import './Register.css'

function Start({colors}){
    const navigate = useNavigate();
    const handleRegisterClick = () => {
        // setFadeOut(true);
        setTimeout(() => {
            navigate('/register');
        }, 0); 
    };
    const handleLoginClick = () => {
        // setFadeOut(true);
        setTimeout(() => {
            navigate('/login');
        }, 0); 
    };

    return(
        <div className="start d-flex justify-content-center align-items-center"
        style={{color: colors.Text, backgroundColor: colors.Background}}>
            <div className="py-5 px-4 br start-inner-container"
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <div className="start-inner d-flex flex-column align-items-center justify-space-between">
                    <div>
                        <h2 className="text-center">Welcome to</h2>
                        <div className="waviy-parent pt-3 pb-5 text-center">
                            <div className="waviy">
                                <span style={{ '--i': 1 }}>B</span>
                                <span style={{ '--i': 2 }}>u</span>
                                <span style={{ '--i': 3 }}>z</span>
                                <span style={{ '--i': 4 }}>z</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="start-end-div text-center">
                        <div className="pb-3">
                            <button onClick={handleRegisterClick} className="normal-btn px-4 py-3 text-sm">Get started</button>
                        </div>
                        
                        <p className="text-sm m-0">Already a user?<span onClick={handleLoginClick} className="link-orange"> Log in</span></p>
                    </div>
                </div>
            </div>
            <p className="text-sm m-0 credit-text">App by <a target="_blank" href="http://abdulwahabasif.com/" className="link-orange">Abdul Wahab</a></p>
        </div>
    )
}

export default Start; 