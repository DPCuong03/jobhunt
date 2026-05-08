"use client";
import api from "@/lib/api";
import { useUserStore } from "@/stores/useUserStore";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

const fetchPaymentOrder = async () => {
  try {
    const response = await api.get("/company/order");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not fetch payment packages";
    throw new Error(message);
  }
};

export default function OrderPage() {
  const { user } = useUserStore();

  const {
    data: packages,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["paymentOrders"],
    queryFn: fetchPaymentOrder,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });

  // Cập nhật logic kiểm tra status dựa trên response thực tế
  const getStatus = (pkg: any) => {
    const isExpired = new Date(pkg.expire_date) < new Date();

    // currently_active trong JSON của bạn là số (0 hoặc 1)
    if (isExpired) {
      return {
        label: "Expired",
        color: "text-red-600 bg-red-50 border-red-100",
        icon: <XCircle size={14} />,
      };
    }

    if (pkg.currently_active === 0) {
      return {
        label: "Inactive",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        icon: <Clock size={14} />,
      };
    }

    return {
      label: "Active",
      color: "text-green-600 bg-green-50 border-green-100",
      icon: <CheckCircle2 size={14} />,
    };
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
        <p className="text-gray-500">
          Track your subscription plans and active packages.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          Error: {(error as Error).message}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages?.map((pkg: any, index: number) => {
                const status = getStatus(pkg);
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {/* Sửa từ pkg.package?.name thành pkg.packages?.package_name */}
                      {pkg.packages?.package_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {pkg.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(pkg.start_date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(pkg.expire_date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!packages || packages.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p>No payment history found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
