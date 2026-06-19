import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    email: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  one = event => {
    this.setState({email: event.target.value})
  }

  two = event => {
    this.setState({password: event.target.value})
  }

  sucess = jwtToken => {
    Cookies.set('jwt_token', jwtToken)

    window.location.href = '/'
  }

  fail = errorMsg => {
    this.setState({
      showError: true,
      errorMsg,
    })
  }

  BusinessLogin= async event => {
    event.preventDefault()

    const {email, password} = this.state

    const userDetails = {
      email,
      password,
    }

    const url =
      'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        this.sucess(data.data.token)
      } else {
        this.fail(data.message)
      }
    } catch (error) {
      this.fail('Something went wrong. Please try again.')
    }
  }

  render() {
    const {email, password, showError, errorMsg} = this.state

    const token = Cookies.get('jwt_token')

    if (token) {
      return <Navigate to="/" replace />
    }

    return (
      <div className="main-con">
        <form className="form-el" onSubmit={this.BusinessLogin}>
          <h1 className="header">Go Business</h1>

          <p className="login-para">
            Sign in to open your referral dashboard.
          </p>

          <div className="inp-con">
            <label htmlFor="email" className="lab"> Email
            </label>

            <input
              id="email" type="email" className="inp" placeholder="you@example.com" value={email}  onChange={this.one}
            />
          </div>

          <div className="inp-con">
            <label htmlFor="password" className="lab"> Password </label>

            <input id="password"  type="password" className="inp" value={password} onChange={this.two}  />
          </div>
        <div class="btn-container">
          <button type="submit" className="but">
            Sign in
          </button>
          </div>

          {showError && <p className="ep">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login