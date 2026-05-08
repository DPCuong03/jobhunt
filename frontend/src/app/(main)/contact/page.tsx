export default function Contact() {
    return (
        <div>
            <div
                className="page-top"
                style={{
                    backgroundImage: "url('/uploads/banner_contact.jpg')",
                }}
            >
                <div className="bg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Contact Us</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="contact-form">
                                <form action="/contact" method="post">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="person_name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="person_email"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Message
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            name="person_message"
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary bg-website"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="map">{/* Map code */}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
