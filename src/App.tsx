import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import SplashScreen from "./pages/SplashScreen";
import Feed from "./pages/Feed";

// Lazy-loaded pages (not needed on first render)
const Chat = lazy(() => import("./pages/Chat"));
const Services = lazy(() => import("./pages/Services"));
const Settings = lazy(() => import("./pages/Settings"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const ExpertDetail = lazy(() => import("./pages/ExpertDetail"));
const MiniApp = lazy(() => import("./pages/MiniApp"));
const GPBArchitect = lazy(() => import("./pages/GPBArchitect"));
const MESProtection = lazy(() => import("./pages/MESProtection"));
const MSBSkills = lazy(() => import("./pages/MSBSkills"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const Chats = lazy(() => import("./pages/Chats"));
const History = lazy(() => import("./pages/History"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Minimal loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TenantProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="desktop-backdrop">
          <div className="mobile-shell">
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/splash" replace />} />
                  <Route path="/splash" element={<SplashScreen />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/service/:id" element={<ServiceDetail />} />
                  <Route path="/service/:id/expert/:expertId" element={<ExpertDetail />} />
                  <Route path="/mini-app/gpb-architect" element={<GPBArchitect />} />
                  <Route path="/mini-app/mes-protection" element={<MESProtection />} />
                  <Route path="/mini-app/msb-skills" element={<MSBSkills />} />
                  <Route path="/mini-app/:id" element={<MiniApp />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </TenantProvider>
  </QueryClientProvider>
);

export default App;
