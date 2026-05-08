"use client";
import { Check, X } from "lucide-react";

interface PricePlan {
  title: string;
  price: string;
  priceId: string;
  duration: string;
  features: { text: string; included: boolean }[];
  isFeatured?: boolean;
}

const PriceCard = ({
  plan,
  onSubscribe,
}: {
  plan: PricePlan;
  onSubscribe: any;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col h-full w-full items-center hover:shadow-md transition-shadow">
      {/* Plan Header */}
      <div className="text-3xl font-extrabold text-green-600 mb-2">
        {plan.title}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">${plan.price}</div>
      <div className="text-gray-500 text-sm mb-4">({plan.duration})</div>

      <div className="w-full border-t border-gray-300 mb-4"></div>

      {/* Features List */}
      <ul className="w-full space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-700">
            {feature.included ? (
              <Check className="w-4 h-4 text-gray-800 mr-3" strokeWidth={3} />
            ) : (
              <X className="w-4 h-4 text-gray-800 mr-3" strokeWidth={3} />
            )}
            {feature.text}
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        onClick={() => onSubscribe(plan.priceId)}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition-colors"
      >
        Choose Plan
      </button>
    </div>
  );
};

export default PriceCard;
