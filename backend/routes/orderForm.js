import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import validator from 'validator';
import generateToken from '../generatetoken.js';
import { getOrderModel } from '../models/order.js';
import OrderCounter from '../models/orderCounter.js';
import User from '../models/user.js';
dotenv.config();

const router = express.Router();

// Place Order
router.post('/', async (req, res) => {
  try {
    const {
      email,
      deliveryInfo,
      items,
      paymentMethod,
      subtotal,
      discount,
      deliveryCharge,
      total
    } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Please login to place an order' });
    }

    // Validate required fields
    if (!deliveryInfo || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order information' });
    }

    // Generate unique order ID
    const counter = await OrderCounter.findByIdAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = "MD" + counter.seq.toString().padStart(6, "0");

    // Calculate estimated delivery (3 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    // Create order
    const Order = await getOrderModel();
    const order = await Order.create({
      orderId,
      userId: user.userId,
      deliveryInfo,
      items,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal,
      discount,
      deliveryCharge,
      total,
      orderStatus: 'confirmed',
      estimatedDelivery
    });

    const token = generateToken(order._id);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Generate items HTML
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <small style="color: #666;">${item.generic_name || ''}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"MediPlus" <${process.env.EMAIL_USER}>`,
      to: deliveryInfo.email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-id { background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .section-title { color: #3b82f6; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            .total-row { font-weight: bold; background: #f3f4f6; }
            .button { background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order</p>
            </div>
            
            <div class="content">
              <div class="order-id">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Order ID</p>
                <h2 style="margin: 5px 0; color: #3b82f6;">${orderId}</h2>
              </div>

              <p>Hello <strong>${deliveryInfo.fullName}</strong>,</p>
              <p>Your order has been successfully placed and confirmed! We'll start processing it right away.</p>

              <div class="section">
                <h3 class="section-title">📦 Order Items</h3>
                <table>
                  <thead>
                    <tr style="background: #f3f4f6;">
                      <th style="padding: 10px; text-align: left;">Item</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                    <tr>
                      <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                      <td style="padding: 10px; text-align: right;">$${subtotal.toFixed(2)}</td>
                    </tr>
                    ${discount > 0 ? `
                    <tr>
                      <td colspan="2" style="padding: 10px; text-align: right; color: #10b981;"><strong>Discount:</strong></td>
                      <td style="padding: 10px; text-align: right; color: #10b981;">-$${discount.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td colspan="2" style="padding: 10px; text-align: right;"><strong>Delivery Charge:</strong></td>
                      <td style="padding: 10px; text-align: right;">${deliveryCharge === 0 ? '<span style="color: #10b981;">FREE</span>' : '$' + deliveryCharge.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="2" style="padding: 15px; text-align: right; font-size: 18px;">Total:</td>
                      <td style="padding: 15px; text-align: right; font-size: 18px; color: #10b981;">$${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="section">
                <h3 class="section-title">🚚 Delivery Address</h3>
                <p style="margin: 5px 0;"><strong>${deliveryInfo.fullName}</strong></p>
                <p style="margin: 5px 0;">${deliveryInfo.address}</p>
                <p style="margin: 5px 0;">${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zipCode}</p>
                ${deliveryInfo.landmark ? `<p style="margin: 5px 0; color: #6b7280;">Landmark: ${deliveryInfo.landmark}</p>` : ''}
                <p style="margin: 5px 0;">📞 ${deliveryInfo.phone}</p>
              </div>

              <div class="section">
                <h3 class="section-title">💳 Payment Method</h3>
                <p><strong>${paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</strong></p>
                <p style="color: #6b7280; font-size: 14px;">
                  ${paymentMethod === 'cod' ? 'Please keep exact cash ready for delivery' : 'Payment received successfully'}
                </p>
              </div>

              <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; color: #10b981; font-size: 16px;">
                  <strong>📅 Estimated Delivery: ${estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </p>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" class="button">
                  Track Your Order
                </a>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing <strong>MediPlus</strong>!</p>
              <p>If you have any questions, please contact us at support@mediplus.com</p>
              <p style="color: #9ca3af; font-size: 12px;">This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Order placed successfully! Confirmation email sent.",
      orderId: orderId,
      order: order
    });

  } catch (err) {
    console.error("Order placement failed:", err);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
});

// Get user orders
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const Order = await getOrderModel();
    const orders = await Order.find({ userId: user.userId }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get specific order
router.get('/:orderId', async (req, res) => {
  try {
    const Order = await getOrderModel();
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;