import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2, ShieldAlert } from "lucide-react";
import aiClubLogo from "@/assets/ai-club-logo.jpeg";
import { getApiUrl } from "../lib/api";

interface AuthBarrierProps {
  children: React.ReactNode;
}

export default function AuthBarrier({ children }: AuthBarrierProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkAuth = async (token: string | null) => {
    try {
      const apiBaseUrl = getApiUrl('/api/auth/me');
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(apiBaseUrl, { headers, credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setErrorMsg(null);
          return true;
        }
      }
    } catch (e) {
      console.error("Auth check failed:", e);
    }
    setIsAuthenticated(false);
    return false;
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      await checkAuth(token);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const apiBaseUrl = getApiUrl('/api/auth/google');
      const syncRes = await fetch(apiBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
        credentials: "include",
      });

      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData.status === "success") {
          if (syncData.token) {
            localStorage.setItem("auth_token", syncData.token);
          }
          setIsAuthenticated(true);
        } else {
          setErrorMsg(syncData.message || "Failed to authenticate with backend.");
        }
      } else {
        const errText = await syncRes.text();
        setErrorMsg(`Server Error: ${errText || syncRes.statusText}`);
      }
    } catch (syncErr: any) {
      console.error("Failed to sync login:", syncErr);
      setErrorMsg("Unable to connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999] overflow-hidden">
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <img
            src={aiClubLogo}
            alt="AI Club Logo"
            className="w-16 h-16 rounded-2xl object-cover shadow-2xl border border-primary/20 animate-bounce"
          />
          <Loader2 className="animate-spin text-primary w-8 h-8 mt-2" />
          <p className="text-sm text-muted-foreground font-medium tracking-wide animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#07090e] flex items-center justify-center p-4 z-[9999] overflow-hidden">
        {/* Abstract animated glowing background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/15 rounded-full blur-[150px] pointer-events-none" />

        {/* Matrix/AI grid style background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-card/60 backdrop-blur-2xl border border-border/80 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden flex flex-col items-center">
          {/* Neon top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Logo container */}
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-50 blur-sm animate-pulse" />
            <img
              src={aiClubLogo}
              alt="AI Club DAU Logo"
              className="relative w-20 h-20 rounded-2xl object-cover border border-border"
            />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground font-display text-center mb-2">
            Welcome to AI Club <span className="text-primary">DAU</span>
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs leading-relaxed">
            Please sign in with your Google account to access events, projects, resources, and the AI chatbot.
          </p>

          {/* Login button container */}
          <div className="w-full flex justify-center py-2 px-1 relative z-10">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg("Google OAuth sign-in failed.")}
              theme="filled_blue"
              size="large"
              shape="pill"
              text="signin_with"
              logo_alignment="left"
            />
          </div>

          {errorMsg && (
            <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs max-w-sm animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/40 w-full flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <span>🛡️ Secure Authentication</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
