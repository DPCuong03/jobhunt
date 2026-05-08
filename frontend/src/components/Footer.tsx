import Link from "next/link";

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        <div className="item">
                            <h2 className="heading">For Candidates</h2>
                            <ul className="useful-links">
                                <li>
                                    <Link href="/job-listing">Browse Jobs</Link>
                                </li>
                                <li>
                                    <Link href="/candidate/dashboard">
                                        Candidate Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/candidate/bookmarks">
                                        Bookmarked Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/candidate/applications">
                                        Applied Jobs
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="item">
                            <h2 className="heading">For Companies</h2>
                            <ul className="useful-links">
                                <li>
                                    <Link href="/company-listing">
                                        Browse Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company/dashboard">
                                        Company Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company/jobs/create">
                                        Post New Job
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company/applications">
                                        Candidate Applications
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="item">
                            <h2 className="heading">Contact</h2>
                            <div className="list-item">
                                <div className="left">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div className="right">Address here</div>
                            </div>
                            <div className="list-item">
                                <div className="left">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div className="right">Phone here</div>
                            </div>
                            <div className="list-item">
                                <div className="left">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="right">Email here</div>
                            </div>
                            <ul className="social">
                                {/* Social links */}
                                <li>
                                    <a href="#" target="_blank">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                </li>
                                {/* Add more */}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="item">
                            <h2 className="heading">Newsletter</h2>
                            <p>
                                To get the latest news from our website, please
                                subscribe us here:
                            </p>
                            <form
                                action="/subscriber"
                                method="post"
                                className="form_subscribe_ajax"
                            >
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control"
                                    />
                                    <span className="text-danger error-text email_error"></span>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="Subscribe Now"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
