export default function JobCategories() {
    const categories = [
        { name: "Technology", icon: "fas fa-code", count: 120 },
        { name: "Marketing", icon: "fas fa-bullhorn", count: 80 },
        // Add more
    ];

    return (
        <div>
            <div
                className="page-top"
                style={{
                    backgroundImage:
                        "url('/uploads/banner_job_categories.jpg')",
                }}
            >
                <div className="bg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Job Categories</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="row">
                        {categories.map((cat, index) => (
                            <div key={index} className="col-md-4">
                                <div className="item">
                                    <div className="icon">
                                        <i className={cat.icon}></i>
                                    </div>
                                    <h3>{cat.name}</h3>
                                    <p>({cat.count} Open Positions)</p>
                                    <a
                                        href={`/job-listing?category=${cat.name}`}
                                    ></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
