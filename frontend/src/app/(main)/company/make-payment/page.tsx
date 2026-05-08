"use client";
import PriceCard from "@/components/PriceCard";
import api from "@/lib/api";

export default function MakePaymentPage() {
  // 1. Dữ liệu thực tế khớp với thiết kế mẫu
  const plans = [
    {
      title: "Basic",
      price: "19",
      priceId: "price_1TPJ56KO25beYc75UxRIjdOM",
      duration: "1 Week",
      features: [
        { text: "2 Job Post Allowed", included: true },
        { text: "No Featured Job", included: false },
        { text: "No Company Photos", included: false },
        { text: "No Company Videos", included: false },
      ],
    },
    {
      title: "Standard",
      price: "29",
      priceId: "price_1TPJ6GKO25beYc757j6udMEA",
      duration: "1 Month",
      features: [
        { text: "4 Job Post Allowed", included: true },
        { text: "2 Featured Job", included: true },
        { text: "2 Company Photos", included: true },
        { text: "2 Company Videos", included: true },
      ],
    },
    {
      title: "Gold",
      price: "49",
      priceId: "price_1TPJaMKO25beYc75lZZtdMiF",
      duration: "3 Months",
      features: [
        { text: "Unlimited Job Post", included: true },
        { text: "15 Featured Job", included: true },
        { text: "10 Company Photos", included: true },
        { text: "10 Company Videos", included: true },
      ],
    },
  ];

  const handleSubscribe = async (priceId: any) => {
    try {
      const response = await api.post("/company/create-checkout-session", {
        priceId,
      });

      // Debug xem data nằm ở đâu
      console.log("Full Response:", response);

      // Axios mặc định để dữ liệu trong field .data
      // Nếu backend trả về { url: '...' } thì nó sẽ là response.data.url
      const checkoutUrl = response.data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        // Nếu log ra lỗi này, hãy nhìn vào Console của trình duyệt
        // để xem cái log "Full Response" phía trên
        console.error(
          "Did not receive checkout URL from server. Response data:",
          response.data,
        );
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  return (
    <div>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Package Pricing</h2>
          <p className="text-gray-500">Get your best packages.</p>
        </div>

        {/* Điều chỉnh gap và max-width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div key={index} className="flex">
              <PriceCard plan={plan} onSubscribe={handleSubscribe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
