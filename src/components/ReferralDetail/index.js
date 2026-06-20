import {useEffect, useState} from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import NotFound from '../NotFound'
import './index.css'

const ReferralDetail = () => {
  const {id} = useParams()
  const navigate = useNavigate()
const [notFound, setNotFound] = useState(false)
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
 

  const referral_logout = () => {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  useEffect(() => {
    const getReferralDetails = async () => {
      const token = Cookies.get('jwt_token')

      const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`

      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          setNotFound(true)
          setLoading(false)
          return
        }

        const data = await response.json()

        let matchedReferral = null

        if (
          data.data &&
          data.data.id &&
          String(data.data.id) === String(id)
        ) {
          matchedReferral = data.data
        } else if (
          data.data &&
          Array.isArray(data.data.referrals)
        ) {
          matchedReferral = data.data.referrals.find(
            each => String(each.id) === String(id),
          )
        }

        if (matchedReferral) {
          setReferral(matchedReferral)
        } else {
          setNotFound(true)
        }

        setLoading(false)
      } catch (error) {
        setNotFound(true)
        setLoading(false)
      }
    }

    getReferralDetails()
  }, [id])

  const formatProfit = value =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
if (loading) {
  return <h1>Loading...</h1>
}

if (notFound || !referral) {
  return <NotFound />
}
/* Getting the Referral Details */
  return (
    <>
      <nav className="navbar">
        <div >
        <h1 className="logo">Go Business</h1>
</div>
        <div className="nav-right">
          <Link to="/" className="link-home">
            Home
          </Link>

          <button
            type="button"
            className="logout-btn"
            onClick={referral_logout}
          >
            Log Out
          </button>
        </div>
      </nav>

      <div className="referral-detail-container">

        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>

        <h1>Referral Details</h1>
        <p>Full information for this referral partner.</p>

        <div className="referral-card">
          <div className="card-header">
            <h2>{referral.name}</h2>
            <span>{referral.serviceName}</span>
          </div>

          <div className="card-row">
            <p>REFERRAL ID</p>
            <p>{referral.id}</p>
          </div>

          <div className="card-row">
            <p>NAME</p>
            <p>{referral.name}</p>
          </div>

          <div className="card-row">
            <p>SERVICE NAME</p>
            <p>{referral.serviceName}</p>
          </div>

          <div className="card-row">
            <p>DATE</p>
            <p>{referral.date.replaceAll('-', '/')}</p>
          </div>

          <div className="card-row">
            <p>PROFIT</p>
            <p>{formatProfit(referral.profit)}</p>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default ReferralDetail