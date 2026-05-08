const Slider = () => {
  return (
    <div
      className="slider "
      style={{ backgroundImage: "url('/uploads/post_1672906463.jpg')" }}
    >
      <div className="bg"></div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="item">
              <div className="text">
                <h2>Find Your Dream Job</h2>
                <p>
                  Discover thousands of job opportunities and take the next step
                  in your career.
                </p>
              </div>
              <div className="search-section">
                <form action="/job-listing" method="get">
                  <div className="inner">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="form-group">
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="Job Title"
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="form-group">
                          <select
                            name="category"
                            className="form-select select2"
                          >
                            <option value="">Job Category</option>
                            {/* Options */}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="form-group">
                          <select
                            name="location"
                            className="form-select select2"
                          >
                            <option value="">Job Location</option>
                            {/* Options */}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <input type="hidden" name="type" value="" />
                        <input type="hidden" name="experience" value="" />
                        <input type="hidden" name="gender" value="" />
                        <input type="hidden" name="salary_range" value="" />
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-search"></i> Search
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
