import { useCurriculumResources, useCurriculumProgress } from "@/hooks/useCurriculum";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressTrackerCard() {
  const { data: resources = [], isLoading: loadingResources } = useCurriculumResources();
  const token = localStorage.getItem("access_token");
  const { data: progress = [], isLoading: loadingProgress } = useCurriculumProgress(token);

  const totalResources = resources.length;
  const totalCompleted = progress.length;
  const progressPercentage = totalResources > 0 ? Math.round((totalCompleted / totalResources) * 100) : 0;

  if (loadingResources) return null;

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-400 opacity-20 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8 flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-sm font-semibold mb-4 backdrop-blur-sm border border-white/20">
                <BookOpenCheck className="w-4 h-4 mr-2" />
                Curriculum Tracker
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Track Your Learning Progress
              </h2>
              <p className="text-indigo-100 text-lg max-w-xl mb-6">
                Master AI step-by-step. Follow our curated curriculum, complete tasks, and watch your progress grow.
              </p>
              <Link
                to="/curriculum"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-900 bg-white hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl active:scale-95 duration-200"
              >
                View Curriculum
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </Link>
            </div>

            {/* Circular Progress Widget */}
            <div className="relative flex-shrink-0 flex items-center justify-center bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-indigo-900/40 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-emerald-400 stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercentage / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-black text-white">{progressPercentage}%</span>
                  <span className="text-xs text-indigo-200 font-medium uppercase tracking-wider mt-1">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
