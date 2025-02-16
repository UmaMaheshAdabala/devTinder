const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const premiumRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const membershipAmount = require("../utils/constants");
const User = require("../models/user");

premiumRouter.post("/premium/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    var order = razorpayInstance.orders.create({
      amount: membershipAmount[membershipType],
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        membershipType: membershipType,
      },
    });

    // Save the order in DB
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    // Send order to frontend

    const savedpayment = await payment.save();

    res.json({ ...savedpayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

premiumRouter.post("/premium/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

premiumRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  if (user.isPremium) return res.status(200).json({ ...user });
  return res.json({ ...user });
});

module.exports = premiumRouter;
