import Link from "next/link";

const BlogSection = () => {
  const posts = [
    {
      id: 1,
      title: "Blog Post 1",
      short_description: "Short desc",
      photo: "/uploads/blog1.jpg",
      slug: "post-1",
    },
    // Add more
  ];

  return (
    <div className="blog">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading">
              <h2>Latest Blog</h2>
              <p>Read our latest articles.</p>
            </div>
          </div>
        </div>
        <div className="row">
          {posts.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <div className="item">
                <div className="photo">
                  <img src={item.photo} alt="" />
                </div>
                <div className="text">
                  <h2>
                    <Link href={`/post/${item.slug}`}>{item.title}</Link>
                  </h2>
                  <div className="short-des">
                    <p>{item.short_description}</p>
                  </div>
                  <div className="button">
                    <Link
                      href={`/post/${item.slug}`}
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
  );
};

export default BlogSection;
