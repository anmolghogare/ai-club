import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import AchievementsPage from "./pages/AchievementsPage.tsx";
import AuthBarrier from "./components/AuthBarrier.tsx";
import BackgroundCanvas from "./components/club/BackgroundCanvas.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

// Lazy-load Admin so its ~185KB bundle is never loaded by public visitors
const Admin = lazy(() => import("./pages/Admin.tsx"));

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
          <Routes>
            {/* ── Public routes — no login required ── */}
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />

            {/* ── Protected route — admin only ── */}
            <Route
              path="/admin"
              element={
                <AuthBarrier>
                  <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading admin panel...</div>}>
                    <Admin />
                  </Suspense>
                </AuthBarrier>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
