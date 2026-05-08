const JobCategories = () => {
    const categories = [
        { name: "Technology", icon: "fas fa-code", count: 120 },
        // Add more
    ];

    return (
        <div className="job-category">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="heading">
                            <h2>Popular Job Categories</h2>
                            <p>Explore jobs by category</p>
                        </div>
                    </div>
                </div>
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
                <div className="row">
                    <div className="col-md-12">
                        <div className="all">
                            <a
                                href="/job-categories"
                                className="btn btn-primary"
                            >
                                See All Categories
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCategories;
