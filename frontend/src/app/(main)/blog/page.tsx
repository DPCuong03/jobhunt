import Link from "next/link";

export default function Blog() {
    const posts = [
        {
            id: 1,
            title: "Blog Post 1",
            excerpt: "Short description",
            slug: "post-1",
        },
        // Add more
    ];

    return (
        <div>
            <div
                className="page-top"
                style={{ backgroundImage: "url('/uploads/banner_blog.jpg')" }}
            >
                <div className="bg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Blog</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="row">
                        {posts.map((post) => (
                            <div key={post.id} className="col-lg-4 col-md-6">
                                <div className="item">
                                    <div className="text">
                                        <h2>
                                            <Link href={`/post/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>
                                        <div className="short-des">
                                            <p>{post.excerpt}</p>
                                        </div>
                                        <div className="button">
                                            <Link
                                                href={`/post/${post.slug}`}
                                                className="btn btn-primary"
                                            >
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
