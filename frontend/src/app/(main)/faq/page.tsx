export default function FAQ() {
    const faqs = [
        {
            question: "How to apply for a job?",
            answer: "Click on the job and fill the form.",
        },
        // Add more
    ];

    return (
        <div>
            <div
                className="page-top"
                style={{ backgroundImage: "url('/uploads/banner_faq.jpg')" }}
            >
                <div className="bg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Frequently Asked Questions</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {faqs.map((faq, index) => (
                                <div key={index} className="faq-item">
                                    <h3>{faq.question}</h3>
                                    <p>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
