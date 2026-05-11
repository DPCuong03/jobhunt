export default function ForgotPassword() {
  return (
    <div>
      <div
        className="page-top"
        style={{ backgroundImage: "url('/uploads/banner_forget.jpg')" }}
      >
        <div className="bg"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Forgot Password - Candidate</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="forget-form">
                <form action="/forget-password-candidate" method="post">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" />
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
