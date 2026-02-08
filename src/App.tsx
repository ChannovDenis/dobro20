import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Stylist from "./pages/Stylist";
import ServiceDetail from "./pages/ServiceDetail";
import MiniApp from "./pages/MiniApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stylist" element={<Stylist />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/mini-app/:id" element={<MiniApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
