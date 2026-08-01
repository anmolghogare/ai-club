import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 z-[1]">
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 glass-card p-8 md:p-12 max-w-md w-full text-center border border-border bg-card/30 backdrop-blur-md shadow-2xl"
      >
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-mono mb-6 bg-destructive/10 border border-destructive/30 text-destructive">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          ROUTE NOT RESOLVED
        </div>

        {/* Big Code */}
        <h1 
          className="font-display font-extrabold text-7xl md:text-8xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          style={{ textShadow: "0 0 40px hsl(var(--primary) / 0.2)" }}
        >
          404
        </h1>

        {/* Text */}
        <h2 className="text-xl md:text-2xl font-bold font-display text-foreground mb-3">
          Lost in Digital Space
        </h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          The requested page <code className="text-primary font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-xs">{location.pathname}</code> does not exist or has been shifted in this timeline.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-bold btn-glow text-primary-foreground transition-all duration-300"
          >
            <Home size={14} /> Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-bold text-foreground border border-border bg-transparent hover:border-primary hover:bg-primary/5 transition-all duration-300"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
