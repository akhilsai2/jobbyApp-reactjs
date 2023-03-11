import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const logOut = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-cont">
      <Link to="/" className="link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="head-logo"
        />
      </Link>
      <div className="link-cont">
        <ul className="list-cont">
          <Link to="/" className="link">
            <li className="item-cont">
              <p className="head-para">Home</p>
            </li>
          </Link>
          <Link to="/jobs" className="link">
            <li className="item-cont">
              <p className="head-para">Jobs</p>
            </li>
          </Link>
        </ul>
        <button className="logout-btn" type="button" onClick={logOut}>
          Logout
        </button>
      </div>
      <div className="icon">
        <ul className="icon-cont">
          <Link to="/" className="link">
            <li className="items">
              <AiFillHome className="home-icon" />
            </li>
          </Link>
          <Link className="link" to="/jobs">
            <li className="items">
              <BsBriefcaseFill className="home-icon" />
            </li>
          </Link>
        </ul>
        <button className="logout-icon-btn" type="button" onClick={logOut}>
          <FiLogOut className="logout-icon" />
        </button>
      </div>
    </nav>
  )
}
export default withRouter(Header)
