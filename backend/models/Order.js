const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        image: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "return_requested", "returned", "cancelled"],
      default: "pending",
    },
    returnReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
