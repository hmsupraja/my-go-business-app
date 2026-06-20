import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import './index.css'

class Dashboard extends Component {
 state = {
  dashboardData: null,
  loading: true,
  er: '',
  search: '',
  sort: 'desc',
  curr_page: 1,
}

  componentDidMount() {
    this.dashboardData()
  }

  dashboardData = async () => {
    const {search, sort} = this.state

    const token = Cookies.get('jwt_token')

    let url =
      'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

    const params = []

    if (search) {
      params.push(`search=${search}`)
    }

    if (sort) {
      params.push(`sort=${sort}`)
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.setState({
          dashboardData: data.data,
          loading: false,
        })
      } else {
        this.setState({
          er: data.message,
          loading: false,
        })
      }
    } catch {
      this.setState({
        er: 'Something went wrong',
        loading: false,
      })
    }
  }

  searchChange = event => {
    this.setState(
      {
        search: event.target.value,
        curr_page: 1,
      },
      this.dashboardData,
    )
  }

  changeSort = event => {
    this.setState(
      {
        sort: event.target.value,
      },
      this.dashboardData,
    )
  }

  logout = () => {
    Cookies.remove('jwt_token')
    window.location.href = '/login'
  }

  copyText = value => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = value
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'

      document.body.appendChild(textArea)

      textArea.focus()
      textArea.select()

      document.execCommand('copy')

      document.body.removeChild(textArea)
    }

    alert('Copied Successfully')
  } catch (error) {
    alert('Unable to copy')
  }
}

  changePage = page => {
    this.setState({
      curr_page: page,
    })
  }

  renderOverview = metrics => (
    <div className="overview-grid">
      {metrics.map(item => (
        <div key={item.id} className="overview-card">
          <h2>{item.value}</h2>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  )
/* Dashboard rendering*/
  render() {
    const {dashboardData, loading, er, curr_page} = this.state

    if (loading) {
      return <h1>Loading...</h1>
    }

    if (er) {
      return <h1>{er}</h1>
    }

    if (!dashboardData) {
      return <h1>No Data Available</h1>
    }

    const {
      metrics,
      serviceSummary,
      referral,
      referrals,
    } = dashboardData

    const rowPerPage = 10

    const start = (curr_page - 1) * rowPerPage

    const end = start + rowPerPage

    const currRows = referrals.slice(start, end)

    const totalPages = Math.ceil(referrals.length / rowPerPage)

    return (
      <div className="dash_cont">
        <nav className="navbar">
          <h1 className="logo">Go Business</h1>

          <div className="nav-right">
            <Link to="/" className="link-home">
              Home
            </Link>

            <button
              type="button"
              className="logout-btn"
              onClick={this.logout}
            >
              Log Out
            </button>
          </div>
        </nav>

        <div className="cont-2">
          <h1 className="dash-heading">
            Referral Dashboard
          </h1>

          <p className="dash-para">
            Track your referrals, earnings and
            partner activity in one place.
          </p>

          <section className="section">
            <h3>Overview</h3>
            {this.renderOverview(metrics)}
          </section>

          <section className="section">
            <h3>Service summary</h3>

            <div className="sum-grid">
              <div className="summ-card">
                <p>SERVICE</p>
                <h4>{serviceSummary.service}</h4>
              </div>

              <div className="summ-card">
                <p>YOUR REFERRALS</p>
                <h4>
                  {serviceSummary.yourReferrals}
                </h4>
              </div>

              <div className="summ-card">
                <p>ACTIVE REFERRALS</p>
                <h4>
                  {serviceSummary.activeReferrals}
                </h4>
              </div>

              <div className="summ-card">
                <p>TOTAL REF. EARNINGS</p>
                <h4>
                  {serviceSummary.totalRefEarnings}
                </h4>
              </div>
            </div>
          </section>

          <section className="section">
  <h3>Refer friends and earn more</h3>

  <div className="refer-grid">
    <div className="refer-item">
      <p>Your Referral Link</p>

      <div className="copy-box">
        <input
          type="text"
          readOnly
          value={referral?.link || ''}
        />

        <button
  type="button"
  onClick={() => this.copyText(referral?.link)}
>
  Copy
</button>
      </div>
    </div>

    <div className="refer-item">
      <p>Your Referral Code</p>

      <div className="copy-box">
        <input
          type="text"
          readOnly
         value={referral?.code || ''}
        />
<button
  type="button"
  onClick={() => this.copyText(referral?.code)}
>
  Copy
</button>
      </div>
    </div>
  </div>
</section>
          <section className="section">
            <div className="table-header">
            <h3>All referrals</h3>

              <div className="controls">
                <input
                  type="search"
                  placeholder="Name or Service..."
                  onChange={this.searchChange}
                />

                <select
                  onChange={this.changeSort}
                >
                  <option value="desc">
                    Newest First
                  </option>

                  <option value="asc">
                    Oldest First
                  </option>
                </select>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Profit</th>
                </tr>
              </thead>

              <tbody>
                {currRows.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No matching entries
                    </td>
                  </tr>
                ) : (
                  currRows.map(item => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          to={`/referral/${item.id}`}
                        >
                          {item.name}
                        </Link>
                      </td>

                      <td>
                        {item.serviceName}
                      </td>

                      <td>
                        {item.date.replaceAll(
                          '-',
                          '/',
                        )}
                      </td>

                      <td>
                        {new Intl.NumberFormat(
                          'en-US',
                          {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          },
                        ).format(item.profit)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination">
              <p>
                Showing{' '}
                {referrals.length === 0
                  ? 0
                  : start + 1}
                -
                {Math.min(
                  end,
                  referrals.length,
                )}{' '}
                of {referrals.length} entries
              </p>

              <div>
                <button
                  type="button"
                  disabled={curr_page === 1}
                  onClick={() =>
                    this.changePage(
                      curr_page - 1,
                    )
                  }
                >
                  Previous
                </button>

                {[...Array(totalPages)].map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        this.changePage(
                          index + 1,
                        )
                      }
                    >
                      {index + 1}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={
                    curr_page === totalPages
                  }
                  onClick={() =>
                    this.changePage(
                      curr_page + 1,
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="footer">
          <p>Go Business</p>

          <div>
            <span>About</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>

          <p>© 2026 Go Business</p>
        </footer>
      </div>
    )
  }
}

export default Dashboard