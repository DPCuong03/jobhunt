const WhyChoose = () => {
  const items = [
    {
      heading: "Quick Apply",
      text: "You can just create your account in our website and apply for desired job very quickly.",
      // Using SVG-like icons or generic icon class names
      icon: "💼",
    },
    {
      heading: "Search Tool",
      text: "We provide a perfect and advanced search tool for job seekers, employers or companies.",
      icon: "🔍",
    },
    {
      heading: "Best Companies",
      text: "The best and reputed worldwide companies registered here and so you will get the quality jobs.",
      icon: "🔗",
    },
  ];

  return (
    <section
      className="relative py-24 bg-cover bg-center bg-no-repeat bg-fixed text-white"
      style={{
        backgroundImage: "url('/uploads/why_choose_home_background.jpg')",
      }}
    >
      {/* Dark Overlay to match the image */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our Methods to help you build your career in future
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container with the White Border from your image */}
              <div className="w-16 h-16 mb-6 flex items-center justify-center border border-white/50 rounded-lg group-hover:border-white transition-colors">
                <span className="text-3xl">{item.icon}</span>
                {/* If using FontAwesome: <i className={`${item.icon} text-2xl`}></i> */}
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {item.heading}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
