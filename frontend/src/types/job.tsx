export interface Job {
  id: number;
  title: string;
  description: string;
  deadline: string;
  vacancy: number;
  is_featured: number;
  is_urgent: number;
  created_at: string;
  companies: {
    company_name: string;
    logo: string;
    address: string;
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
