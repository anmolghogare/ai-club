import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import AchievementsPage from "./pages/AchievementsPage.tsx";
import AuthBarrier from "./components/AuthBarrier.tsx";
import BackgroundCanvas from "./components/club/BackgroundCanvas.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Single shared canvas — renders behind all pages */}
          <BackgroundCanvas />
          {/* Reset scroll to top on every route change */}
          <ScrollToTop />
          <AuthBarrier>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthBarrier>
        </BrowserRouter>
      </TooltipProvider>

    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
