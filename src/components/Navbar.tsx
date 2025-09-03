import { useCart } from "@/components/cartcontext.tsx";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assests/med_logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Consultation', href: '/consult' },
    { name: 'Lab Tests', href: '/lab-tests' },
    { name: 'Store', href: '/store' },
    { name: 'Health Blog', href: '/health-blog' },
  ];

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
  };

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r p-2 rounded-lg">
              <img src={Logo} alt="Logo" className='w-14 h-14' />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">Mediplus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-indigo-600">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </DialogTrigger>

              {/* Cart Modal */}
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Your Cart</DialogTitle>
                </DialogHeader>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item.id)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => increaseQuantity(item.id)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-4 border-t flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>

                    <Button className="w-full bg-indigo-600 text-white mt-4">Checkout</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Signup/Login Button with Dialog */}
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md"
              onClick={() => setAuthDialogOpen(true)}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Cart */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-indigo-600">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Your Cart</DialogTitle>
                </DialogHeader>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item.id)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => increaseQuantity(item.id)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-4 border-t flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>

                    <Button className="w-full bg-indigo-600 text-white mt-4">Checkout</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Signup/Login Button */}
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg shadow-md text-sm"
              onClick={() => setAuthDialogOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Choice Dialog */}
      {authDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Do you already have an account?</h2>
            <div className="flex justify-around">
              <Button onClick={() => { setAuthDialogOpen(false); navigate("/login"); }} className="bg-blue-600 text-white">
                Yes, Login
              </Button>
              <Button onClick={() => { setAuthDialogOpen(false); navigate("/signup"); }} className="bg-green-600 text-white">
                No, Signup
              </Button>
            </div>
            <button
              onClick={() => setAuthDialogOpen(false)}
              className="mt-4 text-sm text-gray-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
