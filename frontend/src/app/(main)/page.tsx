import Slider from "@/components/Slider";
import JobCategories from "@/components/JobCategories";
import WhyChoose from "@/components/WhyChoose";
import FeaturedJobs from "@/components/FeaturedJobs";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <div>
      <Slider />
      <JobCategories />
      <WhyChoose />
      <FeaturedJobs />
      <Testimonials />
      <BlogSection />
    </div>
  );
}
