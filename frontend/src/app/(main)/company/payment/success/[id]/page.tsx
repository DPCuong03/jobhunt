"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const packageId = searchParams.get("packageId");

  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        if (!sessionId || !packageId) {
          setError("Invalid payment session");
          setLoading(false);
          return;
        }

        const response = await api.post("/company/create-order", {
          packageId: parseInt(packageId),
          sessionId,
        });

        if (response.data) {
          setOrderData(response.data.data);
          setOrderCreated(true);
          toast.success("Payment successful! Order created.");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to create order";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Order creation error:", err);
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [sessionId, packageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Processing your payment...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please wait while we confirm your order
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <Link
              href="/company/make-payment"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </Link>
            <Link
              href="/company/dashboard"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your order has been created successfully.
        </p>

        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-800">
                  {orderData.order_no}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-800">
                  ${orderData.paid_amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-semibold text-gray-800">
                  {orderData.packages?.package_name || "Premium"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(orderData.start_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiry Date:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(orderData.expire_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/company/orders"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Orders
          </Link>
          <Link
            href="/company/dashboard"
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}
