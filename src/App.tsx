import PostBlog from '@/components/BlogFormPopup';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./components/cartcontext.tsx";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import ConsultPage from "./pages/ConsultPage";
import HealthBlogPage from "./pages/HealthBlogPage";
import Index from "./pages/Index";
import LabTestPage from "./pages/LabTestPage";
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import Signup from './pages/Signup';
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <CartProvider>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
              <div key="app" className="min-h-screen">
                {/* Navbar now handles Clerk components internally */}
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/post" element={<PostBlog isOpen={true} blogTitle={""}/>}></Route>
                  <Route path="/consult" element={<ConsultPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/lab-tests" element={<LabTestPage />} />
                  <Route path="/health-blog" element={<HealthBlogPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            )}
          </AnimatePresence>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;