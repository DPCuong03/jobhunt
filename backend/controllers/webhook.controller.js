import prisma from "../lib/db.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceToIdMap = {
  price_1TPJ56KO25beYc75UxRIjdOM: 1, // Thay bằng Price ID thực tế cho gói Basic
  price_1TPJ6GKO25beYc757j6udMEA: 2, // Thay bằng Price ID thực tế cho gói Standard
  price_1TPJaMKO25beYc75lZZtdMiF: 3, // Thay bằng Price ID thực tế cho gói Gold
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Xác thực xem có đúng là Stripe gửi không (dùng whsec_... lấy từ CLI)
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý sự kiện sau khi đã xác thực xong
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Metadata received:", session.metadata);
    // Lấy thông tin bạn đã đính kèm vào metadata lúc tạo session
    const { companyId, packageId: stripePriceId } = session.metadata;

    const dbPackageId = priceToIdMap[stripePriceId];

    if (!dbPackageId) {
      console.error("Error: Invalid package ID", stripePriceId);
      return res.status(400).send("Invalid Price ID");
    }

    // 1. Tính toán ngày hết hạn (Expire Date)
    const startDate = new Date();
    const expireDate = new Date();

    // Logic: Gói 1 = 7 ngày, Gói 2 = 30 ngày, Gói 3 = 90 ngày
    const daysToAdd = dbPackageId === 1 ? 7 : dbPackageId === 2 ? 30 : 90;
    expireDate.setDate(startDate.getDate() + daysToAdd);

    try {
      const activeOrder = await prisma.orders.findFirst({
        where: {
          company_id: parseInt(companyId),
          currently_active: 1,
        },
      });
      if (
        activeOrder &&
        activeOrder.package_id > dbPackageId &&
        new Date(activeOrder.expire_date) > new Date()
      ) {
        await prisma.orders.create({
          data: {
            where: { company_id: parseInt(companyId) },
            currently_active: 0, // Không kích hoạt ngay vì gói cũ xịn hơn
          },
        });
      } else {
        await prisma.orders.updateMany({
          where: { company_id: parseInt(companyId) },
          data: { currently_active: 0 },
        });
      }

      // 3. Tạo đơn hàng mới vào table orders
      await prisma.orders.create({
        data: {
          companies: {
            connect: { id: parseInt(companyId) },
          },
          packages: {
            connect: { id: dbPackageId },
          },
          order_no: session.id.slice(-10), // Lấy 10 ký tự cuối làm mã đơn
          paid_amount: (session.amount_total / 100).toString(), // Stripe trả về amount bằng cents, nên chia 100 để ra dollars
          payment_method: "Stripe",
          start_date: startDate.toISOString().split("T")[0],
          expire_date: expireDate.toISOString().split("T")[0],
          created_at: new Date(),
          updated_at: new Date(),
          currently_active: 1, // Gói mới mua sẽ là gói kích hoạt
        },
      });

      console.log(`Successfully updated order for Company ID: ${companyId}`);
    } catch (dbError) {
      console.error("Database Save Error:", dbError);
      return res.status(500).json({ error: "Could not save order" });
    }
  }

  res.json({ received: true });
};
