"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  FileText,
  Bookmark,
  Mail,
  Phone,
} from "lucide-react";

// Import only the relative time function
import { formatDate } from "@/lib/utils/date";

export default function CompanyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/company-detail/${id}`,
        );
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompany();
  }, [id]);

  if (loading)
    return (
      <div className="p-20 text-center text-gray-500">
        Loading company details...
      </div>
    );
  if (!data) return <div className="p-20 text-center">Company not found.</div>;

  const { company } = data;

  const openPositionsCount = company.jobs?.length || 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HEADER SECTION */}
      <div
        className="relative pt-5 pb-5 text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/uploads/banner_job_listing.jpg')`,
        }}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8 p-10">
            <div className="w-30 h-30 bg-white rounded-2xl flex items-center justify-center p-2 overflow-hidden shadow-sm">
              <img
                src={
                  company.logo
                    ? `/uploads/${company.logo}`
                    : "/uploads/logo-placeholder.png"
                }
                alt={company.company_name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white ">
                {company.company_name}
              </h2>

              {/* Container(max-width) */}
              <div className="flex flex-wrap gap-x-4 gap-y-0 text-gray-300 text-sm">
                {/* 1. Category */}
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {company.company_industries?.name}
                  </span>
                </div>

                {/* 2. Location */}
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {company.address}
                  </span>
                </div>

                {/* 3. Email */}
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {company.email}
                  </span>
                </div>

                {/* 4. Phone */}
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {company.phone}
                  </span>
                </div>
              </div>
              <div className="bg-[#DDE7FF] text-[#4F75FF] px-4 py-1 rounded-full text-xs font-bold w-fit mb-4 mt-3">
                {openPositionsCount} Open Positions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="container -mt-10">
        <div className="row g-5">
          {/* DESCRIPTION */}
          <div className="col-lg-8">
            <div className="pt-8">
              {" "}
              <div className="flex items-center gap-3 border-b border-gray-600 pb-3 mb-6 h-[40px]">
                <FileText className="text-blue-600" size={22} />
                <h3 className="text-xl font-bold text-gray-800 leading-none">
                  About Company
                </h3>
              </div>
              <div
                className="prose prose-slate max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: company.description }}
              />
            </div>
          </div>

          {/*JOB SUMMARY */}
          <div className="col-lg-4">
            <div className="pt-8 top-24">
              {" "}
              <div className="flex items-center gap-3 border-b border-gray-600 pb-3 mb-6 h-[40px]">
                <FileText className="text-blue-600" size={22} />
                <h4 className="text-xl font-bold text-gray-800 leading-none">
                  Company Overview
                </h4>
              </div>
              {/* Summary Table */}
              <div className="overflow-hidden border-2 border-black rounded-lg">
                <table className="w-full text-left table-fixed border-collapse">
                  <tbody>
                    {[
                      {
                        label: "Contact Person:",
                        value: company.person_name,
                      },
                      {
                        label: "Industry:",
                        value: company.company_industries?.name,
                      },
                      {
                        label: "Location:",
                        value: company.company_locations?.name,
                      },
                      {
                        label: "Company size:",
                        value: company.company_sizes?.name,
                      },
                      { label: "Address:", value: company.address },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className="border-b-2 border-black last:border-0"
                      >
                        <th className="px-4 py-4 text-gray-900 font-bold text-sm w-1/2 border-r-2 border-black">
                          {item.label}
                        </th>
                        <td className="px-4 py-4 text-gray-700 text-sm">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
