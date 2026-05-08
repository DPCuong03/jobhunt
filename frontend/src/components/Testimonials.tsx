const Testimonials = () => {
  // Keeping the data structure simple for a static view
  const testimonial = {
    name: "Sal Harvey",
    designation: "Director, BB Company",
    comment:
      "Vidit sonet te vix, legere aliquip sed et, vix dico graeci placerat no. Ferri docendi appareat qui te, aperiam delenit mediocrem vel in, tantas aliquando intellegam his an. Interesset temporibus eos id, ut saepe petentium vim.",
  };

  return (
    <section
      className="relative py-24 bg-cover bg-center bg-no-repeat bg-fixed text-white"
      style={{
        backgroundImage: "url('/uploads/testimonial_home_background.jpg')",
      }}
    >
      {/* Dark Overlay (The 'bg' class from your original code, now in Tailwind) */}
      <div className="absolute inset-0 bg-black/60 backdrop-brightness-75"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Our Happy Clients
          </h2>
        </div>

        {/* Focused Content Area */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">{testimonial.name}</h3>
            <p className="text-sm text-gray-300 mt-1 uppercase tracking-wide">
              {testimonial.designation}
            </p>
            {/* White separator line from your image */}
            <div className="w-24 h-[2px] bg-white mx-auto mt-4"></div>
          </div>

          <p className="text-lg leading-relaxed text-gray-100 italic md:px-12">
            "{testimonial.comment}"
          </p>

          {/* Static Pagination Dots (Visual only, to match your image) */}
          <div className="flex justify-center gap-2 mt-10">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <div className="w-4 h-4 rounded-full bg-transparent border-2 border-white"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
