export default function ResetPasswordCompany() {
    return (
        <div>
            <div
                className="page-top"
                style={{ backgroundImage: "url('/uploads/banner_reset.jpg')" }}
            >
                <div className="bg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Reset Password - Company</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <div className="reset-form">
                                <form
                                    action="/reset-password-company"
                                    method="post"
                                >
                                    <div className="mb-3">
                                        <label className="form-label">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password_confirmation"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Reset Password
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
