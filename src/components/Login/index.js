import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  successLogin = data => {
    Cookies.set('jwt_token', data, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  getUserName = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  fileSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const UserDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(UserDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    if (response.ok) {
      const data = await response.json()
      this.successLogin(data.jwt_token)
    } else {
      const data = await response.json()
      this.setState({errorMsg: data.error_msg, showError: true})
    }
  }

  render() {
    const {username, password, errorMsg, showError} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bgLogin">
        <div className="login-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
            className="logo"
          />
          <form className="form" onSubmit={this.fileSubmit}>
            <label htmlFor="user-id" className="label">
              USERNAME
            </label>
            <input
              id="user-id"
              className="input"
              placeholder="Username"
              type="text"
              onChange={this.getUserName}
              value={username}
            />
            <label htmlFor="pass-id" className="label">
              PASSWORD
            </label>
            <input
              id="pass-id"
              className="input"
              placeholder="Password"
              type="password"
              onChange={this.getPassword}
              value={password}
            />
            <button className="login-btn" type="submit">
              Login
            </button>
            {showError ? <p className="error">*{errorMsg}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
