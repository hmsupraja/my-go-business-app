import {Link} from 'react-router-dom'
import './index.css'

const NotFound=()=>{
    return(
        <div className='login-cont'>
            <h1 className='code'>404</h1>
            <p className="msg">Page Not Found</p>
            <Link to='/' className="link">
            Back to DashBoard</Link>
        </div>
    )
}
export default NotFound