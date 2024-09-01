import './Notifications.css'

function Notifications({colors, notifications}){
    return(
        <div className='notifications-page max-home-content'>
            <div className='notifications-inner bs br tr px-2 py-3'
            style={{color: colors.Text, backgroundColor: colors.Highlight}}>
                <p className='m-0 text-esm-red pb-1 pt-2 px-2'>Notifications</p>
                <div className='notifications px-2'>
                    {notifications.map(notification => (
                        <div className='my-2 br px-2 py-1'
                        style={{ color: colors.Text, backgroundColor: colors.Input}}>
                            <li key={notification._id}>
                                <p className='m-0 text-sm'>{notification.message}</p>
                                <small className='text-esm'>{new Date(notification.createdAt).toLocaleString()}</small>
                            </li>
                        </div>
                    ))}
                </div> 
            </div>
        </div>
    )
}

export default Notifications;