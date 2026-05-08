import React from "react";
import Link from "next/link";
import { MapPin, Globe, Phone, Mail, Users } from "lucide-react";

interface CompanyCardProps {
  company: {
    id: number;
    company_name: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    // Dữ liệu từ bảng companies trong SQL của bạn
  };
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const imageBaseUrl = "http://localhost:3000/uploads/";

  const logoUrl = company.logo?.startsWith("http")
    ? company.logo
    : `${imageBaseUrl}${company.logo}`;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col h-full relative overflow-hidden">
      {/* Logo & Tên công ty */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-blue-100 transition-colors">
          <img
            src={logoUrl}
            alt={company.company_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <Link href={`/company-detail/${company.id}`}>
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {company.company_name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={14} className="text-red-500" />
            <span className="truncate">{company.address}</span>
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ nhanh */}
      <div className="space-y-2 mb-6 flex-1">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Globe size={16} className="text-blue-500" />
          <span className="truncate">{company.website || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Phone size={16} className="text-green-500" />
          <span>{company.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Mail size={16} className="text-orange-500" />
          <span className="truncate">{company.email}</span>
        </div>
      </div>

      {/* Nút xem chi tiết */}
      <div className="pt-4 border-t border-gray-50">
        <Link
          href={`/company-detail/${company.id}`}
          className="w-full py-2.5 px-4 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-100"
        >
          View Company Profile
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
