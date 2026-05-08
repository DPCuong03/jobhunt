import Link from "next/link";

export default function PostDetail({ params }: { params: { slug: string } }) {
    const post = {
        title: "Blog Post Title",
        content: "Full content here.",
        date: "2023-01-01",
    };

    return (
        <div>
            <div
                className="page-top"
                style={{ backgroundImage: "url('/uploads/banner_post.jpg')" }}
            >
                <div className="bg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>{post.title}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <p>{post.date}</p>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            />
                            <Link href="/blog" className="btn btn-primary">
                                Back to Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
