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
import AuraPage from "./pages/AuraPage.tsx";
import AuthBarrier from "./components/AuthBarrier.tsx";
import Navbar from "./components/club/Navbar.tsx";
import BackgroundCanvas from "./components/club/BackgroundCanvas.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

// Lazy-load heavier pages to keep the initial bundle small
const Admin = lazy(() => import("./pages/Admin.tsx"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage.tsx"));
const MyRegistrationsPage = lazy(() => import("./pages/MyRegistrationsPage.tsx"));

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder_client_id_for_google_oauth_provider.apps.googleusercontent.com";

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: 'hsl(230,15%,50%)', fontSize: '0.9rem' }}>
    Loading…
  </div>
);

import { useLocation } from "react-router-dom";

const HeaderNavbar = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/aura')) {
    return null;
  }
  return <Navbar />;
};

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <BackgroundCanvas />
          <ScrollToTop />
          <HeaderNavbar />
          <Routes>
            {/* ── Public routes — no login required ── */}
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/aura" element={<AuraPage />} />

            {/* ── Event detail page ── */}
            <Route path="/events/:id" element={
              <Suspense fallback={<Loader />}>
                <EventDetailPage />
              </Suspense>
            } />

            {/* ── My registrations (auth handled inside page) ── */}
            <Route path="/my-registrations" element={
              <Suspense fallback={<Loader />}>
                <MyRegistrationsPage />
              </Suspense>
            } />

            {/* ── Protected admin route ── */}
            <Route path="/admin" element={
              <AuthBarrier>
                <Suspense fallback={<Loader />}>
                  <Admin />
                </Suspense>
              </AuthBarrier>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
