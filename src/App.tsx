
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";
import Index from "./pages/Index";
import StorePage from "./pages/StorePage";
import ConsultPage from "./pages/ConsultPage";
import LabTestPage from "./pages/LabTestPage";
import HealthBlogPage from "./pages/HealthBlogPage";
import NotFound from "./pages/NotFound";

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
