"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../lib/api";

interface FeaturedJob {
  id: number;
  title: string;
  deadline: string;
  is_featured: number;
  is_urgent: number;
  created_at: string;
  companies: {
    company_name: string;
    logo: string | null;
  };
  job_categories: {
    name: string;
  };
  job_locations: {
    name: string;
  };
  job_types: {
    name: string;
  };
  job_salary_ranges: {
    name: string;
  };
}

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState<FeaturedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/job/featured");
        setJobs(response.data.jobs || []);
      } catch (err) {
        console.error("Error loading featured jobs:", err);
        setError("Could not load featured jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="job">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading">
              <h2>Featured Jobs</h2>
              <p>Find the awesome jobs that match your skill</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <div className="row">
              {jobs.slice(0, 6).map((job) => (
                <div key={job.id} className="col-lg-6 col-md-12">
                  <div className="item d-flex justify-content-start">
                    <div className="logo">
                      <img
                        src={
                          job.companies.logo
                            ? `/uploads/${job.companies.logo}`
                            : "/uploads/logo1.png"
                        }
                        alt={job.companies.company_name}
                      />
                    </div>
                    <div className="text">
                      <h3>
                        <Link href={`/job-detail/${job.id}`}>
                          {job.title}, {job.companies.company_name}
                        </Link>
                      </h3>
                      <div className="detail-1 d-flex justify-content-start">
                        <div className="category">
                          {job.job_categories.name}
                        </div>
                        <div className="location">{job.job_locations.name}</div>
                      </div>
                      <div className="detail-2 d-flex justify-content-start">
                        <div className="date">{formatDate(job.created_at)}</div>
                        <div className="budget">
                          {job.job_salary_ranges.name}
                        </div>
                      </div>
                      <div className="special d-flex justify-content-start">
                        {job.is_featured === 1 && (
                          <div className="featured">Featured</div>
                        )}
                        <div className="type">{job.job_types.name}</div>
                        {job.is_urgent === 1 && (
                          <div className="urgent">Urgent</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="all">
                  <Link href="/job-listing" className="btn btn-primary">
                    See All Jobs
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedJobs;
