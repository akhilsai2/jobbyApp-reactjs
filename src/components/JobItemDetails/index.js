import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import './index.css'

const apijobDescStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {jobDetailsData: {}, detailStatus: apijobDescStatus.initial}

  componentDidMount() {
    this.getJobId()
  }

  getJobId = async () => {
    this.setState({detailStatus: apijobDescStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const fetchedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        rating: data.job_details.rating,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skills: data.job_details.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }
      this.setState({
        jobDetailsData: fetchedData,
        detailStatus: apijobDescStatus.success,
      })
    } else {
      this.setState({detailStatus: apijobDescStatus.failure})
    }
  }

  renderLoading = () => (
    <>
      <Header />
      <div className="loader" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  productView = () => {
    const {jobDetailsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,

      title,
      jobDescription,
      location,
      rating,
      packagePerAnnum,
      lifeAtCompany,
      skills,
      similarJobs,
    } = jobDetailsData
    return (
      <>
        <Header />
        <div className="jobDetails-cont">
          <div className="job-desc-cont">
            <div className="company-log-cont">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="logo-company job-logo"
              />
              <div className="title-cont">
                <h1 className="title job-title">{title}</h1>
                <div className="rating-cont rating-job-cont">
                  <AiFillStar className="star-icon job-star" />
                  <p className="rating job-rating1">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-price-cont">
              <div className="location-cont">
                <div className="rating-cont">
                  <MdLocationOn className="loc-icon job-loc-icon" />
                  <p className="rating1 job-rating">{location}</p>
                </div>
                <div className="rating-cont">
                  <BsBriefcaseFill className="loc-icon job-loc-icon" />
                  <p className="rating1 job-rating">{employmentType}</p>
                </div>
              </div>
              <p className="package job-package">{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="link-head-cont">
              <h1 className="des-head job">Description</h1>
              <a
                href={companyWebsiteUrl}
                key="company_website_url"
                className="visit"
              >
                Visit <BiLinkExternal className="visit-link" />
              </a>
            </div>
            <p className="des-para jobPara">{jobDescription}</p>
            <h1 className="des-head job1">Skills</h1>
            <ul className="skill-list-cont">
              {skills.map(each => (
                <li key={each.name} className="skill-item-cont">
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-logo"
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="des-head job1">Life at Company</h1>
            <div className="inner-cont">
              <p className="des-para jobPara life">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="inner-img"
              />
            </div>
          </div>
          <div className="similar-cont">
            <h1 className="des-head job">Similar Jobs</h1>
          </div>
          <ul className="sim-list-cont">
            {similarJobs.map(each => (
              <li key={each.id} className="job-item-cont item-job">
                <div className="company-log-cont">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="logo-company job-logo"
                  />
                  <div className="title-cont">
                    <h1 className="title job-title">{each.title}</h1>
                    <div className="rating-cont">
                      <AiFillStar className="star-icon job-star" />
                      <p className="rating job-rating1">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="des-head job j-p">Description</h1>
                <p className="des-para jobPara j-p-d">{each.jobDescription}</p>
                <div className="location-price-cont">
                  <div className="location-cont">
                    <div className="rating-cont">
                      <MdLocationOn className="loc-icon job-loc-icon" />
                      <p className="rating1 job-rating">{each.location}</p>
                    </div>
                    <div className="rating-cont">
                      <BsBriefcaseFill className="loc-icon job-loc-icon" />
                      <p className="rating1 job-rating">
                        {each.employmentType}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  desRetry = () => {
    this.setState({detailStatus: apijobDescStatus.inProgress}, this.getJobId)
  }

  failureVew = () => (
    <>
      <Header />
      <div className="no-cont job-fail">
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
          <button className="retry-btn" type="button" onClick={this.desRetry}>
            Retry
          </button>
        </div>
      </div>
    </>
  )

  render() {
    const {detailStatus} = this.state
    switch (detailStatus) {
      case apijobDescStatus.inProgress:
        return this.renderLoading()
      case apijobDescStatus.success:
        return this.productView()
      case apijobDescStatus.failure:
        return this.failureVew()
      default:
        return null
    }
  }
}
export default JobItemDetails
