import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  BookOpen,
  Code2,
  Layers,
  Cpu,
  Bot,
  Network,
  ArrowUpRight,
  Clock3,
  Route,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getApiUrl } from "../../lib/api";

/* ============================================================
   TYPES
============================================================ */

type RoadmapPhase = {
  phase: string;
  title: string;
  duration: string;
  color: string;
  icon: React.ElementType;
  topics: string[];
};

type RoadmapConfig = {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  number: string;
};

/* ============================================================
   ICON MAP
============================================================ */

const IconMap: Record<string, React.ElementType> = {
  BookOpen,
  BarChart3: Route,
  Layers,
  Cpu,
  Code2,
  Bot,
  Sparkles,
  Network,
  Brain,
};

/* ============================================================
   ROADMAP CONFIG
============================================================ */

const ROADMAP_CONFIG: Record<string, RoadmapConfig> = {
  ML: {
    title: "Machine Learning",
    subtitle: "End-to-End ML Framework",
    icon: Brain,
    accent: "hsl(var(--primary))",
    number: "01",
  },

  DL: {
    title: "Deep Learning",
    subtitle: "Neural Networks & Architectures",
    icon: Cpu,
    accent: "hsl(160 55% 38%)",
    number: "02",
  },

  RL: {
    title: "Reinforcement Learning",
    subtitle: "Agents & Environments",
    icon: Network,
    accent: "hsl(12 70% 48%)",
    number: "03",
  },

  NLP: {
    title: "Natural Language Processing",
    subtitle: "Text & Language Fundamentals",
    icon: BookOpen,
    accent: "hsl(170 55% 36%)",
    number: "04",
  },

  TRANSFORMER: {
    title: "Transformers",
    subtitle: "Attention & Sequence Models",
    icon: Layers,
    accent: "hsl(265 55% 52%)",
    number: "05",
  },

  GENAI: {
    title: "Generative AI",
    subtitle: "GenAI & Foundation Models",
    icon: Sparkles,
    accent: "hsl(330 55% 48%)",
    number: "06",
  },

  LLM: {
    title: "Large Language Models",
    subtitle: "Architecture & Optimization",
    icon: Code2,
    accent: "hsl(195 65% 40%)",
    number: "07",
  },

  AGENTIC: {
    title: "Agentic AI",
    subtitle: "AI Agents & Multi-Agent Systems",
    icon: Bot,
    accent: "hsl(42 75% 42%)",
    number: "08",
  },
};

const ROADMAP_ORDER = [
  "ML",
  "DL",
  "RL",
  "NLP",
  "TRANSFORMER",
  "GENAI",
  "LLM",
  "AGENTIC",
];

/* ============================================================
   PHASE CARD
============================================================ */

function PhaseCard({
  phase,
  index,
  isLast,
}: {
  phase: RoadmapPhase;
  index: number;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(index === 0);
  const Icon = phase.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative pl-11"
    >
      {/* Timeline rail */}
      {!isLast && (
        <div
          className="absolute left-[15px] top-9 bottom-[-12px] w-px"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--border)), transparent)",
          }}
        />
      )}

      {/* Timeline number */}
      <div
        className="
          absolute
          left-0
          top-4
          z-20
          grid
          h-8
          w-8
          place-items-center
          rounded-full
          border
          bg-card
          font-mono
          text-[9px]
          font-semibold
          transition-all
          duration-300
        "
        style={{
          borderColor: `${phase.color || "hsl(var(--primary))"}55`,
          color: phase.color || "hsl(var(--primary))",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Card */}
      <div
        className="
          group
          overflow-hidden
          border
          border-border
          bg-card
          transition-all
          duration-300
          hover:-translate-y-[1px]
          hover:border-primary/40
        "
      >
        {/* Header */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="
            flex
            w-full
            items-center
            gap-4
            p-5
            text-left
            outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/30
          "
        >
          {/* Icon */}
          <div
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-md
              border
              bg-background
            "
            style={{
              borderColor: `${phase.color || "hsl(var(--primary))"}35`,
            }}
          >
            <Icon
              size={17}
              strokeWidth={1.7}
              style={{
                color: phase.color || "hsl(var(--primary))",
              }}
            />
          </div>

          {/* Main information */}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="mono-label">
                {phase.phase}
              </span>

              {phase.duration && (
                <>
                  <span className="text-border">/</span>

                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Clock3 size={10} />
                    {phase.duration}
                  </span>
                </>
              )}
            </div>

            <h3
              className="
                font-display
                text-[15px]
                font-bold
                leading-tight
                text-foreground
                transition-colors
                duration-200
                group-hover:text-primary
              "
            >
              {phase.title}
            </h3>
          </div>

          {/* Toggle */}
          <div
            className="
              grid
              h-8
              w-8
              shrink-0
              place-items-center
              border
              border-border
              bg-background
              text-muted-foreground
              transition-colors
              duration-200
              group-hover:border-primary/30
              group-hover:text-primary
            "
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={15} />
            </motion.div>
          </div>
        </button>

        {/* Topics */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-5 pb-5 pt-4">
                {phase.topics?.length > 0 ? (
                  <div className="space-y-2.5">
                    {phase.topics.map((topic, topicIndex) => (
                      <motion.div
                        key={`${topic}-${topicIndex}`}
                        initial={{
                          opacity: 0,
                          x: -6,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: topicIndex * 0.045,
                          duration: 0.25,
                        }}
                        className="
                          flex
                          items-start
                          gap-3
                          text-[13px]
                          leading-relaxed
                          text-muted-foreground
                        "
                      >
                        <CheckCircle2
                          size={14}
                          strokeWidth={1.7}
                          className="mt-[3px] shrink-0 text-primary"
                        />

                        <span>{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Topics will be added soon.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ============================================================
   ROADMAP COLUMN
============================================================ */

function RoadmapColumn({
  type,
  data,
  delay = 0,
}: {
  type: string;
  data: RoadmapPhase[];
  delay?: number;
}) {
  const config = ROADMAP_CONFIG[type];

  if (!config || !data || data.length === 0) {
    return null;
  }

  const Icon = config.icon;

  const totalTopics = useMemo(
    () =>
      data.reduce(
        (total, phase) => total + (phase.topics?.length || 0),
        0
      ),
    [data]
  );

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      {/* ======================================================
          ROADMAP HEADER
      ====================================================== */}

      <div className="mb-6 border-b border-border pb-5">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            {/* Number */}
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                border
                bg-card
                font-mono
                text-xs
                font-semibold
              "
              style={{
                borderColor: `${config.accent}45`,
                color: config.accent,
              }}
            >
              {config.number}
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Icon
                  size={14}
                  strokeWidth={1.8}
                  style={{
                    color: config.accent,
                  }}
                />

                <span className="mono-label">
                  Learning Path
                </span>
              </div>

              <h3
                className="
                  font-display
                  text-[22px]
                  font-bold
                  leading-tight
                  text-foreground
                  sm:text-[25px]
                "
              >
                {config.title}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* Phase count */}
          <div className="hidden shrink-0 text-right sm:block">
            <div className="font-mono text-[18px] font-semibold text-foreground">
              {String(data.length).padStart(2, "0")}
            </div>

            <div className="mono-label">
              Phases
            </div>
          </div>
        </div>

        {/* Small stats */}
        <div className="mt-5 flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Route size={11} />
            {data.length} phases
          </span>

          <span className="text-border">/</span>

          <span>
            {totalTopics} topics
          </span>
        </div>
      </div>

      {/* ======================================================
          PHASES
      ====================================================== */}

      <div className="space-y-3">
        {data.map((phase, index) => (
          <PhaseCard
            key={`${type}-${phase.phase}-${index}`}
            phase={phase}
            index={index}
            isLast={index === data.length - 1}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-end">
        <span
          className="
            flex
            items-center
            gap-1.5
            font-mono
            text-[9px]
            uppercase
            tracking-[0.08em]
            text-muted-foreground
            transition-colors
            group-hover:text-primary
          "
        >
          View learning path
          <ArrowUpRight size={11} />
        </span>
      </div>
    </motion.article>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function RoadmapSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, columnIndex) => (
        <div key={columnIndex}>
          {/* Header */}
          <div className="mb-6 flex items-start gap-4 border-b border-border pb-5">
            <div className="shimmer h-12 w-12 shrink-0" />

            <div className="flex-1 space-y-2">
              <div className="shimmer h-2.5 w-24" />
              <div className="shimmer h-6 w-48" />
              <div className="shimmer h-3 w-40" />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-4 border border-border bg-card p-5"
              >
                <div className="shimmer h-10 w-10 shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="shimmer h-2.5 w-20" />
                  <div className="shimmer h-4 w-44" />
                </div>

                <div className="shimmer h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyRoadmapState() {
  return (
    <div className="border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center border border-border bg-background">
        <Route
          size={20}
          className="text-muted-foreground"
        />
      </div>

      <h3 className="headline-md">
        Roadmaps are being prepared
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Learning paths will appear here once the roadmap data is available.
      </p>
    </div>
  );
}

/* ============================================================
   ERROR STATE
============================================================ */

function ErrorState() {
  return (
    <div className="border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
      <div className="mx-auto mb-4 grid h-10 w-10 place-items-center border border-destructive/20 bg-card">
        <AlertCircle
          size={18}
          className="text-destructive"
        />
      </div>

      <h3 className="font-display text-lg font-bold">
        Unable to load roadmaps
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState<
    Record<string, RoadmapPhase[]>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          getApiUrl("/api/roadmaps")
        );

        if (!response.ok) {
          throw new Error(
            `Roadmap API failed: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid roadmap response");
        }

        const grouped: Record<string, RoadmapPhase[]> = {};

        data.forEach((item: any) => {
          const roadmapType = item.roadmap_type;

          if (!roadmapType) return;

          const parsedItem: RoadmapPhase = {
            phase: item.phase || "Phase",
            title: item.title || "Untitled Phase",
            duration: item.duration || "",
            color:
              item.color ||
              "hsl(var(--primary))",
            icon:
              IconMap[item.icon_name] ||
              BookOpen,
            topics: Array.isArray(item.topics)
              ? item.topics
              : [],
          };

          if (!grouped[roadmapType]) {
            grouped[roadmapType] = [];
          }

          grouped[roadmapType].push(parsedItem);
        });

        if (mounted) {
          setRoadmaps(grouped);
        }
      } catch (err) {
        console.error(
          "Failed to fetch roadmaps:",
          err
        );

        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRoadmaps();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     TOTALS
  ============================================================ */

  const roadmapCount = ROADMAP_ORDER.filter(
    (type) =>
      roadmaps[type] &&
      roadmaps[type].length > 0
  ).length;

  const totalPhases = ROADMAP_ORDER.reduce(
    (total, type) =>
      total + (roadmaps[type]?.length || 0),
    0
  );

  const totalTopics = ROADMAP_ORDER.reduce(
    (total, type) =>
      total +
      (roadmaps[type] || []).reduce(
        (phaseTotal, phase) =>
          phaseTotal + (phase.topics?.length || 0),
        0
      ),
    0
  );

  return (
    <section
      id="roadmaps"
      className="relative overflow-hidden bg-background"
    >
      {/* ======================================================
          SUBTLE BACKGROUND DETAIL
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[700px]
          -translate-x-1/2
          opacity-[0.045]
          blur-3xl
        "
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)), transparent 68%)",
        }}
      />

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="section-container relative z-10">
        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-14"
        >
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="section-label mb-0">
              04 — Roadmaps
            </span>

            <span className="h-px w-12 bg-border" />

            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              AI Club DAIICT
            </span>
          </div>

          {/* Heading */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h2 className="headline-lg max-w-3xl">
                Learning
                <span className="gradient-text">
                  {" "}Roadmaps
                </span>
              </h2>
            </div>

            <div className="lg:pb-1">
              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                Structured, phase-by-phase guides curated by
                AI Club DAIICT to take you from fundamentals
                to production-ready artificial intelligence.
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-foreground">
                {String(roadmapCount).padStart(2, "0")}
              </span>

              <span className="mono-label">
                Learning Paths
              </span>
            </div>

            <span className="text-border">/</span>

            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-foreground">
                {String(totalPhases).padStart(2, "0")}
              </span>

              <span className="mono-label">
                Phases
              </span>
            </div>

            <span className="text-border">/</span>

            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-foreground">
                {String(totalTopics).padStart(2, "0")}
              </span>

              <span className="mono-label">
                Topics
              </span>
            </div>
          </div>
        </motion.div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        {loading ? (
          <RoadmapSkeleton />
        ) : error ? (
          <ErrorState />
        ) : roadmapCount === 0 ? (
          <EmptyRoadmapState />
        ) : (
          <div className="grid grid-cols-1 gap-x-14 gap-y-16 xl:grid-cols-2">
            {ROADMAP_ORDER.map((type, index) => {
              if (!ROADMAP_CONFIG[type]) {
                return null;
              }

              if (
                !roadmaps[type] ||
                roadmaps[type].length === 0
              ) {
                return null;
              }

              return (
                <RoadmapColumn
                  key={type}
                  type={type}
                  data={roadmaps[type]}
                  delay={
                    index % 2 === 0
                      ? 0
                      : 0.08
                  }
                />
              );
            })}
          </div>
        )}

        {/* ====================================================
            BOTTOM NOTE
        ==================================================== */}

        {!loading &&
          !error &&
          roadmapCount > 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="
                mt-16
                flex
                flex-col
                gap-4
                border-t
                border-border
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-2">
                <Loader2
                  size={13}
                  className="text-primary"
                />

                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  Learning paths evolve with the field
                </span>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                AI CLUB / DAIICT
              </span>
            </motion.div>
          )}
      </div>
    </section>
  );
}
