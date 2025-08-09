import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Remove Clerk imports from App.tsx as they will be in Navbar.tsx
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar"; // Navbar is still imported
import ConsultPage from "./pages/ConsultPage";
import HealthBlogPage from "./pages/HealthBlogPage";
import Index from "./pages/Index";
import LabTestPage from "./pages/LabTestPage";
import NotFound from "./pages/NotFound";
import StorePage from "./pages/StorePage";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
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
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
              <div key="app" className="min-h-screen">
                {/* Navbar now handles Clerk components internally */}
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/consult" element={<ConsultPage />} />
                  <Route path="/lab-tests" element={<LabTestPage />} />
                  <Route path="/health-blog" element={<HealthBlogPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;