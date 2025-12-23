import React, { createContext, useContext, useState, useEffect } from 'react';

// TypeScript interface: Defines the structure of a single cart item
interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  generic_name?: string;
  manufacturer?: string;
  dosage?: string;
  image_url?: string;
  in_stock?: number;
  prescription?: boolean;
  original_price?: number;
  originalPrice?: number;
}

// TypeScript interface: Defines what functions the cart context provides, this is the "contract" - what components can do with the cart
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number | string) => void;
  increaseQuantity: (id: number | string) => void;
  decreaseQuantity: (id: number | string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

//This is like a "box" that will hold cart data, initially undefined, will be filled by CartProvider

const CartContext = createContext<CartContextType | undefined>(undefined);

//component that wraps your app and provides cart functionality; children' = all components inside this provider can access cart

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('mediplus-cart');
      return savedCart ? JSON.parse(savedCart) : [];           // Save: Cart → JSON string → localStorage
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mediplus-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {         // 'Omit<CartItem, 'quantity'>' means item has all CartItem properties EXCEPT quantity
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        // If item exists, increase quantity by 1 
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // If item doesn't exist, add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];      // Spread operator creates new array with all old items + new item
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Increase quantity...Map through cart and update matching item's quantity
  const increaseQuantity = (id: number | string) => {
    setCart((prevCart) =>                           
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id: number | string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);         // Set cart to empty array
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Render: Provide all cart data and functions to child components
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};