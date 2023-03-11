import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import './index.css'

const apiProfileStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const apiJobStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    id: 1,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    id: 2,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    id: 3,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    id: 4,
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
    id: 5,
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
    id: 6,
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
    id: 7,
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
    id: 8,
  },
]

class Jobs extends Component {
  state = {
    profileData: {},
    jobData: {},
    profileStatus: apiProfileStatus.initial,
    jobStatus: apiJobStatus.initial,

    employeType: [],
    minPackage: '',
    searchValue: '',
    search: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileStatus: apiProfileStatus.inProgress})
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: fetchedData,
        profileStatus: apiProfileStatus.success,
      })
    } else {
      this.setState({profileStatus: apiProfileStatus.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobStatus: apiJobStatus.inProgress})
    const token = Cookies.get('jwt_token')
    const {employeType, minPackage, search} = this.state

    const stringlist = employeType.slice(0, employeType.length)
    const employeeString = stringlist.join()
    console.log(employeeString)
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employeeString}&minimum_package=${minPackage}&search=${search}`,
      options,
    )
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,

        jobDescription: each.job_description,
        title: each.title,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
      }))
      this.setState({jobData: updatedData, jobStatus: apiJobStatus.success})
    } else {
      this.setState({jobStatus: apiJobStatus.failure})
    }
  }

  selectType = event => {
    this.setState(
      prevState => ({
        employeType: [...prevState.employeType, event.target.value],
      }),
      this.getJobsData,
    )
  }

  selectSalary = event => {
    this.setState({minPackage: event.target.value}, this.getJobsData)
  }

  searchItem = event => {
    this.setState({searchValue: event.target.value})
  }

  searchJob = () => {
    const {searchValue} = this.state
    this.setState({search: searchValue}, this.getJobsData)
  }

  retry = () => {
    this.setState({profileStatus: apiJobStatus.inProgress}, this.getProfileData)
  }

  jobRetry = () => {
    this.setState({jobStatus: apiJobStatus.inProgress}, this.getJobsData)
  }

  profileCard = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-bg-cont">
        <img src={profileImageUrl} alt="profile" className="profile-dp" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  noProductView = () => (
    <div className="no-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
        alt="no jobs"
        className="no-img"
      />
      <h1 className="no-head">No Jobs Found</h1>
      <p className="no-para">We could not find any jobs, Try other filters</p>
    </div>
  )

  jobsFailure = () => (
    <div className="no-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-head">Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for.
      </p>
      <div className="failure-cont">
        <button className="retry-btn" type="button" onClick={this.jobRetry}>
          Retry
        </button>
      </div>
    </div>
  )

  jobCard = () => {
    const {jobData} = this.state
    if (jobData.length > 0) {
      return (
        <ul className="job-list-cont">
          {jobData.map(each => (
            <Link key={each.id} to={`/jobs/${each.id}`} className="link">
              <li className="job-item-cont">
                <div className="company-log-cont">
                  <img
                    src={each.companyLogoUrl}
                    alt="company logo"
                    className="logo-company"
                  />
                  <div className="title-cont">
                    <h1 className="title">{each.title}</h1>
                    <div className="rating-cont">
                      <AiFillStar className="star-icon" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-price-cont">
                  <div className="location-cont">
                    <div className="rating-cont">
                      <MdLocationOn className="loc-icon" />
                      <p className="rating1">{each.location}</p>
                    </div>
                    <div className="rating-cont">
                      <BsBriefcaseFill className="loc-icon" />
                      <p className="rating1">{each.employmentType}</p>
                    </div>
                  </div>
                  <p className="package">{each.packagePerAnnum}</p>
                </div>
                <hr />
                <h1 className="des-head">Description</h1>
                <p className="des-para">{each.jobDescription}</p>
              </li>
            </Link>
          ))}
        </ul>
      )
    }
    return this.noProductView()
  }

  profileLoading = () => (
    <div className="loader-container " data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobLoading = () => (
    <div className="loader " data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileRetry = () => (
    <div className="failure-cont">
      <button className="retry-btn" type="button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiProfileStatus.success:
        return this.profileCard()
      case apiProfileStatus.inProgress:
        return this.profileLoading()
      case apiProfileStatus.failure:
        return this.profileRetry()
      default:
        return null
    }
  }

  renderJobs = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case apiJobStatus.success:
        return this.jobCard()
      case apiJobStatus.inProgress:
        return this.jobLoading()
      case apiJobStatus.failure:
        return this.jobsFailure()
      default:
        return null
    }
  }

  renderType = () => (
    <ul className="list-check-cont">
      {employmentTypesList.map(each => (
        <li key={each.id} className="check-item">
          <input
            type="checkbox"
            name="typeEmployee"
            id={`inputCheckId-${each.id}`}
            className="input-check"
            value={each.employmentTypeId}
            onChange={this.selectType}
          />
          <label className="check-label" htmlFor={`inputCheckId-${each.id}`}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSalary = () => (
    <ul className="list-check-cont">
      {salaryRangesList.map(each => (
        <li key={each.id} className="check-item">
          <input
            type="radio"
            name="salary"
            id={`inputRadioId-${each.id}`}
            className="input-check"
            value={each.salaryRangeId}
            onChange={this.selectSalary}
          />
          <label className="check-label" htmlFor={`inputRadioId-${each.id}`}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  render() {
    const {searchValue} = this.state
    return (
      <>
        <Header />
        <div className="job-bg-cont">
          <div className="search-cont1">
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              value={searchValue}
              onChange={this.searchItem}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.searchJob}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filter-cont">
            {this.renderProfile()}
            <hr />
            <div className="time-cont">
              <h1 className="type-head">Type of Employment</h1>

              {this.renderType()}
            </div>
            <hr />
            <div className="time-cont">
              <h1 className="type-head">Salary Range</h1>

              {this.renderSalary()}
            </div>
          </div>
          <div className="job-container">
            <div className="search-cont">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.searchItem}
                value={searchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.searchJob}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
