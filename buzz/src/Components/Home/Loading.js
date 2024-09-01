import './Loading.css'
import Logo from '../../assets/logo.png'

function Loading(){
    return(
        <div className="loading d-flex align-items-center justify-content-center">
            <div className='loading-inner'>
                <div className='loading-logo'>
                    <img className='br' src={Logo} />
                    <div className='loading-spinner text-center mt-3'>
                        <i className="fa-solid fa-spinner"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading; 