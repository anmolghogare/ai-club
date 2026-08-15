import { useMemo, useState } from "react";
import { useCurriculumResources, useCurriculumProgress, useToggleProgress } from "../../hooks/useCurriculum";
import { useToast } from "../ui/use-toast";
import { CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/club/Footer";

export default function CurriculumPage() {
  const { data: resources = [], isLoading: loadingResources } = useCurriculumResources();
  const token = localStorage.getItem("auth_token");
  const { data: progress = [], isLoading: loadingProgress } = useCurriculumProgress(token);
  const toggleProgress = useToggleProgress();
  const { toast } = useToast();

  const [openTopics, setOpenTopics] = useState<string[]>([]);

  // Group resources by topic
  const groupedResources = useMemo(() => {
    const groups: Record<string, typeof resources> = {};
    resources.forEach((r) => {
      if (!groups[r.group_name]) groups[r.group_name] = [];
      groups[r.group_name].push(r);
    });
    return Object.entries(groups).map(([topic, items]) => ({
      topic,
      items,
      completedCount: items.filter((item) => progress.includes(item.id)).length,
      totalCount: items.length,
    }));
  }, [resources, progress]);

  const toggleTopic = (topic: string) => {
    setOpenTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleToggleResource = async (resourceId: number) => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your progress.",
        variant: "destructive",
      });
      return;
    }
    
    // Optimistic toggle locally
    try {
      await toggleProgress.mutateAsync({ resourceId, token });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate overall progress
  const totalResources = resources.length;
  const totalCompleted = progress.length;
  const progressPercentage = totalResources > 0 ? Math.round((totalCompleted / totalResources) * 100) : 0;

  return (
    <div className="min-h-screen relative font-sans text-gray-900 bg-[#F4F6FB] overflow-hidden">
      
      <main className="relative z-10 pt-32 pb-24 px-6 sm:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-indigo-900 to-indigo-600 mb-4">
            My Curriculum Progress
          </h1>
          <p className="text-lg text-indigo-700/70 max-w-2xl mx-auto font-medium">
            Track your journey through our AI resources. Mark items as completed as you go!
          </p>
        </motion.div>

        {/* Overall Progress Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 mb-12 flex flex-col md:flex-row items-center justify-between border border-white/40 backdrop-blur-sm">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">Overall Completion</h2>
            <p className="text-indigo-600 font-medium">
              You have completed {totalCompleted} out of {totalResources} resources.
            </p>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-indigo-100 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <circle
                className="text-indigo-600 stroke-current"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-indigo-900">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Topics Accordion */}
        <div className="space-y-4">
          {loadingResources ? (
            <div className="text-center text-indigo-500 py-12">Loading curriculum...</div>
          ) : (
            groupedResources.map((group, index) => {
              const isOpen = openTopics.includes(group.topic);
              const isGroupCompleted = group.completedCount === group.totalCount && group.totalCount > 0;
              const groupProgress = group.totalCount > 0 ? (group.completedCount / group.totalCount) * 100 : 0;

              return (
                <div key={index} className="bg-white rounded-2xl shadow-md border border-indigo-50/50 overflow-hidden">
                  <button
                    onClick={() => toggleTopic(group.topic)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-indigo-50/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {isGroupCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-indigo-200" />
                      )}
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-indigo-900">{group.topic}</h3>
                        <p className="text-sm text-indigo-500 font-medium mt-0.5">
                          {group.completedCount} / {group.totalCount} Completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Mini progress bar */}
                      <div className="hidden sm:block w-32 h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${groupProgress}%` }}
                        />
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-indigo-50 bg-indigo-50/20 px-6 py-4">
                          <ul className="space-y-3">
                            {group.items.map((item) => {
                              const isCompleted = progress.includes(item.id);
                              return (
                                <li key={item.id} className="flex items-start md:items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-indigo-50/50 group">
                                  <div className="flex items-start space-x-4">
                                    <button
                                      onClick={() => handleToggleResource(item.id)}
                                      className="mt-1 md:mt-0 flex-shrink-0 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                      ) : (
                                        <Circle className="w-6 h-6 text-gray-300 hover:text-indigo-400 transition-colors" />
                                      )}
                                    </button>
                                    <div>
                                      <h4 className={`font-semibold text-base transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-indigo-700'}`}>
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 md:line-clamp-none">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-4 flex-shrink-0 p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                                    title="Open Resource"
                                  >
                                    <ExternalLink className="w-5 h-5" />
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
