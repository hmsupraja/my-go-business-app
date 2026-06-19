import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <h1 className="heading">404</h1>

    <p className="para">Page not found</p>

    <Link to="/" className="link">
      Back to dashboard
    </Link>
  </div>
)

export default NotFound