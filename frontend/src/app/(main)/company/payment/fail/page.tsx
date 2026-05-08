"use client";
import React from "react";
import { XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-2">
          Unfortunately, your payment could not be processed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please check your card details and try again, or contact support if
          the problem persists.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-semibold text-yellow-800">
                Possible reasons for failure:
              </p>
              <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                <li>• Insufficient funds</li>
                <li>• Card expired or invalid</li>
                <li>• Transaction declined by bank</li>
                <li>• Connection timeout</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/company/make-payment"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </Link>
          <Link
            href="/company/dashboard"
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3">
            If you need help, please contact our support team:
          </p>
          <a
            href="mailto:support@jobhunt.com"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            support@jobhunt.com
          </a>
        </div>
      </div>
    </div>
  );
}
