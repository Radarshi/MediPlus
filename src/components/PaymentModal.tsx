import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import  QRCode  from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;      
    type: string;      
    duration: string;  
    price: number;    
  };
  merchantUpiId?: string;
  merchantName?: string;
}
const PaymentModal = ({ 
  isOpen, 
  onClose, 
  plan, 
  merchantUpiId = "kdrama21k-2@oksbi",
  merchantName = "MediPlus", }: PaymentModalProps) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });

  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const bookingIdRef = React.useRef(
    `CS${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  );

  // Updates a single field in formData object
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (paymentMethod !== "upi") return;

    const amount = plan.price;
    const tn = encodeURIComponent(`Booking ${bookingIdRef.current}`);
    const pa = encodeURIComponent(merchantUpiId);
    const pn = encodeURIComponent(merchantName);
    const upiUri = `upi://pay?pa=${pa}&pn=${pn}&am=${amount}&cu=INR&tn=${tn}`;

    // Generate data URL QR
    QRCode.toDataURL(upiUri, { margin: 1 })
      .then((url) => setUpiQrDataUrl(url))
      .catch((err) => {
        console.error("QR generation failed:", err);
        setUpiQrDataUrl(null);
      });
  }, [paymentMethod, plan.price, merchantUpiId, merchantName]);

  // Generic function that signals booking complete (sends to backend to send email)
  const finalizeBookingAndSendEmail = async (booking: {
    planName: string;
    duration: string;
    amount: number;
    bookingId: string;
    email: string;
    name?: string;
    paymentMethod: "card" | "upi";
    txnId?: string | null;
  }) => {
    // call your server endpoint to send confirmation email and record booking
    const resp = await fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Send-confirmation error:", errorText);
      throw new Error("Failed to send confirmation");
    }

    return true;
  };

  // handle card payment -> simulate payment + send email
  const handleCardPayment = async () => {
    try {
      setStep(3); // processing
      await new Promise((res) => setTimeout(res, 2000));

      const booking = {
        planName: `${plan.name} ${plan.type} Consultation`,
        duration: plan.duration,
        amount: plan.price,
        bookingId: bookingIdRef.current,
        email: formData.email,
        name: formData.nameOnCard,
        paymentMethod: "card" as const,
        txnId: null,
      };

      await finalizeBookingAndSendEmail(booking);
      setStep(4);
    } catch (err) {
      console.error(err);
      // handle error UI/notification (for simplicity: show success but log)
      setStep(4);
    }
  };

  // handle click on "I have paid" in UPI flow -> verify (or simulate) then send email
  const handleUpiPaid = async () => {
    try {
      setIsVerifying(true);
      setStep(3); // processing

      // In production, you'd call your backend to verify via TSP/webhook or check your records
      // For demo, we simulate a wait then succeed
      await new Promise((res) => setTimeout(res, 2000));

      const fakeTxnId = `UPI${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      const booking = {
        planName: `${plan.name} ${plan.type} Consultation`,
        duration: plan.duration,
        amount: plan.price,
        bookingId: bookingIdRef.current,
        email: formData.email,
        name: formData.nameOnCard,
        paymentMethod: "upi" as const,
        txnId: fakeTxnId,
      };

      await finalizeBookingAndSendEmail(booking);
      setIsVerifying(false);
      setStep(4);
    } catch (err) {
      console.error("UPI verify/send error:", err);
      setIsVerifying(false);
      setStep(4); // optionally show error state instead
    }
  };

  const handlePayment = async () => {
    // route to the appropriate handler by method
    if (paymentMethod === "card") {
      await handleCardPayment();
    } else {
      // for UPI we go to step that shows QR, user clicks "I have paid" to call handleUpiPaid
      setStep(2); // ensure UPI UI visible
    }
  };

  const handleClose = () => {
    setStep(1);
    setPaymentMethod("card");
    setFormData({
      email: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
      billingAddress: "",
      city: "",
      zipCode: "",
    });
    onClose();
  };

  if (!plan) return null;

   return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Complete Payment</h1>
                    <p className="text-white/90">Secure checkout for your consultation</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Step 1: Order summary + choose payment method */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold">{plan.name} {plan.type} Consultation</h3>
                          <p className="text-sm text-gray-600">{plan.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{plan.price} Rs.</div>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total</span>
                          <span>{plan.price} Rs.</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment method selector */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Choose payment method</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`flex-1 p-3 rounded-lg border ${
                          paymentMethod === "card" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                        }`}
                      >
                        Pay with Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex-1 p-3 rounded-lg border ${
                          paymentMethod === "upi" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                        }`}
                      >
                        Pay with UPI
                      </button>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-lg py-3"
                      onClick={handlePayment}
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 (Card UI or UPI QR depending on paymentMethod) */}
              {step === 2 && paymentMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <h3 className="text-lg font-semibold">Card payment</h3>
                  </div>

                  {/* Payment Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          placeholder="you@domain.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date</label>
                          <Input
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV</label>
                          <Input
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Name on Card</label>
                        <Input
                          placeholder="John Doe"
                          value={formData.nameOnCard}
                          onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <Input
                          placeholder="123 Main St"
                          value={formData.billingAddress}
                          onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City</label>
                          <Input
                            placeholder="New York"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">ZIP Code</label>
                          <Input
                            placeholder="10001"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600"
                      onClick={handleCardPayment}
                      disabled={
                        !formData.cardNumber ||
                        !formData.nameOnCard ||
                        !formData.email
                      }
                    >
                      Pay ₹{plan.price}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && paymentMethod === "upi" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <h3 className="text-lg font-semibold">Pay with UPI</h3>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Scan to Pay</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Scan this QR with your UPI app to pay ₹{plan.price}</p>
                      <div className="flex flex-col items-center gap-3">
                        {upiQrDataUrl ? (
                          <img src={upiQrDataUrl} alt="UPI QR" className="w-48 h-48 bg-white p-2 rounded-md" />
                        ) : (
                          <div className="w-48 h-48 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-sm text-gray-500">Generating QR...</span>
                          </div>
                        )}

                        <div className="text-sm text-gray-600">
                          <div><strong>UPI ID:</strong> {merchantUpiId}</div>
                          <div><strong>Payee:</strong> {merchantName}</div>
                          <div><strong>Booking ID:</strong> {bookingIdRef.current}</div>
                        </div>

                        <div className="w-full max-w-xs">
                          <label className="block text-sm font-medium mb-2">Your email (to receive confirmation)</label>
                          <Input
                            placeholder="you@domain.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button
                            className="bg-gradient-to-r from-indigo-500 to-purple-600"
                            onClick={handleUpiPaid}
                            disabled={!formData.email || isVerifying}
                          >
                            {isVerifying ? "Verifying..." : "I have paid"}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              // regenerate QR (useful if merchant id or amount changed)
                              setUpiQrDataUrl(null);
                              // effect will regenerate because paymentMethod is still 'upi' - or you can directly call
                              QRCode.toDataURL(
                                `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(
                                  merchantName
                                )}&am=${plan.price}&cu=INR&tn=${encodeURIComponent("Booking " + bookingIdRef.current)}`,
                                { margin: 1 }
                              ).then((url) => setUpiQrDataUrl(url));
                            }}
                          >
                            Regenerate QR
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Processing */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
                  <p className="text-gray-600">Please wait while we process your payment...</p>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-600">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">Your consultation has been booked successfully.</p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2">Booking Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Plan: {plan.name} {plan.type} Consultation</p>
                      <p>Duration: {plan.duration}</p>
                      <p>Amount Paid: ₹{plan.price}</p>
                      <p>Booking ID: {bookingIdRef.current}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600" onClick={handleClose}>
                    Done
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;