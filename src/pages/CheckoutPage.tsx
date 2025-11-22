import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, CreditCard, CheckCircle, ShoppingBag, Truck, Clock,
  User, Phone, Mail, Home, Calendar, Lock, Shield, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/cartcontext.tsx';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();     // Get cart data and clearCart function from context
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form state, store delivery information form data
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card'
  });

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  };

  const calculateOriginalTotal = () => {
    return cart.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.original_price || item.price;
      return sum + (Number(originalPrice) * Number(item.quantity));
    }, 0);
  };

  const calculateDiscount = () => {
    return calculateOriginalTotal() - calculateSubtotal();
  };

  const calculateDeliveryCharge = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 4.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryCharge();
  };

  // Handle form changes
  const handleDeliveryChange = (field, value) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  // Validate delivery info
  const validateDeliveryInfo = () => {
    const { fullName, email, phone, address, city, state, zipCode } = deliveryInfo;
    return fullName && email && phone && address && city && state && zipCode;
  };

  // Validate payment info
  const validatePaymentInfo = () => {
    if (paymentInfo.paymentMethod === 'cod') return true;
    const { cardNumber, cardName, expiryDate, cvv } = paymentInfo;
    return cardNumber && cardName && expiryDate && cvv;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order ID
    const newOrderId = 'MD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderId(newOrderId);
    
    setIsProcessing(false);
    setOrderPlaced(true);
    clearCart();
  };

  // Steps configuration
  const steps = [
    { number: 1, title: 'Delivery Details', icon: MapPin },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review Order', icon: ShoppingBag }
  ];

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="text-center">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>

                <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your order. We've received your order and will process it shortly.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="text-sm text-gray-500 mb-2">Order ID</div>
                  <div className="text-2xl font-bold text-gray-800 mb-4">{orderId}</div>
                  
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="text-sm text-gray-500">Order Total</div>
                      <div className="font-bold text-lg">${calculateTotal().toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Delivery To</div>
                      <div className="font-bold text-lg">{deliveryInfo.fullName}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
                  <Truck className="w-5 h-5" />
                  <span className="font-semibold">Expected delivery: 2-3 business days</span>
                </div>

                <div className="flex gap-4">
                  <a href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </a>
                  <a href="/store" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500">
                      Continue Shopping
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty cart redirect
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="container mx-auto px-6 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items before checkout</p>
          <a href="/store">
            <Button className="bg-gradient-to-r from-blue-500 to-green-500">
              Browse Store
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <a href="/cart">
            <Button variant="ghost" className="mb-4 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </a>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    currentStep >= step.number ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Delivery Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Delivery Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="John Doe"
                              value={deliveryInfo.fullName}
                              onChange={(e) => handleDeliveryChange('fullName', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              value={deliveryInfo.email}
                              onChange={(e) => handleDeliveryChange('email', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="+1 (555) 000-0000"
                            value={deliveryInfo.phone}
                            onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Address *</label>
                        <div className="relative">
                          <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <textarea
                            placeholder="Street address, apartment, suite, etc."
                            value={deliveryInfo.address}
                            onChange={(e) => handleDeliveryChange('address', e.target.value)}
                            className="w-full pl-10 p-2 border rounded-lg min-h-[80px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City *</label>
                          <Input
                            placeholder="New York"
                            value={deliveryInfo.city}
                            onChange={(e) => handleDeliveryChange('city', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">State *</label>
                          <Input
                            placeholder="NY"
                            value={deliveryInfo.state}
                            onChange={(e) => handleDeliveryChange('state', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                          <Input
                            placeholder="10001"
                            value={deliveryInfo.zipCode}
                            onChange={(e) => handleDeliveryChange('zipCode', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
                        <Input
                          placeholder="Near Central Park"
                          value={deliveryInfo.landmark}
                          onChange={(e) => handleDeliveryChange('landmark', e.target.value)}
                        />
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 mt-6"
                        onClick={() => setCurrentStep(2)}
                        disabled={!validateDeliveryInfo()}
                      >
                        Continue to Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        <div
                          onClick={() => handlePaymentChange('paymentMethod', 'card')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentInfo.paymentMethod === 'card'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5" />
                              <div>
                                <div className="font-semibold">Credit/Debit Card</div>
                                <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              paymentInfo.paymentMethod === 'card'
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {paymentInfo.paymentMethod === 'card' && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePaymentChange('paymentMethod', 'cod')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentInfo.paymentMethod === 'cod'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Truck className="w-5 h-5" />
                              <div>
                                <div className="font-semibold">Cash on Delivery</div>
                                <div className="text-sm text-gray-500">Pay when you receive</div>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              paymentInfo.paymentMethod === 'cod'
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {paymentInfo.paymentMethod === 'cod' && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Details Form */}
                      {paymentInfo.paymentMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-4 border-t"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-2">Card Number *</label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="1234 5678 9012 3456"
                                value={paymentInfo.cardNumber}
                                onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                                className="pl-10"
                                maxLength={19}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                            <Input
                              placeholder="John Doe"
                              value={paymentInfo.cardName}
                              onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="MM/YY"
                                  value={paymentInfo.expiryDate}
                                  onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                                  className="pl-10"
                                  maxLength={5}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">CVV *</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  placeholder="123"
                                  value={paymentInfo.cvv}
                                  onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                                  className="pl-10"
                                  maxLength={4}
                                  type="password"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span>Your payment information is secure and encrypted</span>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex gap-4 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-blue-500 to-green-500"
                          onClick={() => setCurrentStep(3)}
                          disabled={!validatePaymentInfo()}
                        >
                          Review Order
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Delivery Address */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Delivery Address
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-semibold">{deliveryInfo.fullName}</p>
                        <p className="text-gray-600">{deliveryInfo.address}</p>
                        <p className="text-gray-600">
                          {deliveryInfo.city}, {deliveryInfo.state} {deliveryInfo.zipCode}
                        </p>
                        {deliveryInfo.landmark && (
                          <p className="text-sm text-gray-500">Landmark: {deliveryInfo.landmark}</p>
                        )}
                        <p className="text-gray-600">{deliveryInfo.phone}</p>
                        <p className="text-gray-600">{deliveryInfo.email}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Payment Method
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {paymentInfo.paymentMethod === 'card' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Credit/Debit Card</p>
                            <p className="text-sm text-gray-500">
                              •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Cash on Delivery</p>
                            <p className="text-sm text-gray-500">Pay when you receive</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Order Items ({cart.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="max-h-14 object-contain" />
                            ) : (
                              <span className="text-2xl">💊</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-green-500"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>

                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- ${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span>
                      {calculateDeliveryCharge() === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${calculateDeliveryCharge().toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                  </div>

                  <div className="mt-4 space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Free delivery on orders above $50</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Estimated delivery: 2-3 days</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <span>100% secure payment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;