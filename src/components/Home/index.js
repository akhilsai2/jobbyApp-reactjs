import {Component} from 'react'
import {Redirect, Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    const token = Cookies.get('jwt_token')
    console.log(token)
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="home-bg-cont">
          <div className="home-cont">
            <h1 className="home-head">Find The Job That Fits Your Life</h1>
            <p className="home-para">
              Millions of people are searching for jobs, salary information ,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button className="find-btn" type="button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}
export default withRouter(Home)
