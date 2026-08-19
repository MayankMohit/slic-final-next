"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowUpRight,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-isMobile";
import SecondaryButton from "@/components/ui/secondaryBtn";

type WorkItem = {
  id: number;
  title: string;
  description: string;
  videoSrc: string;
  meta?: string;
};

// Each card names a distinct ad format and the job it does in the funnel, so
// the carousel reads as range rather than five variants of the same thing.
const WORK_ITEMS: WorkItem[] = [
  {
    id: 1,
    title: "Science Story Ad",
    description: "Hard research softened into a scene parents actually finish.",
    videoSrc: "/homeVideos/vid1.mp4",
    meta: "Story • TOF",
  },
  {
    id: 2,
    title: "Manufacturing Proof Ad",
    description: "Behind the line footage that justifies the price tag.",
    videoSrc: "/homeVideos/vid2.mp4",
    meta: "Brand • Trust",
  },
  {
    id: 3,
    title: "Testimonial Stack Ad",
    description:
      'Stacked parent results that dismantle the "does it work" objection.',
    videoSrc: "/homeVideos/vid3.mp4",
    meta: "UGC • Proof",
  },
  {
    id: 4,
    title: "Villain Character Ad",
    description: "Turns the ingredient buyers fear into a face they remember.",
    videoSrc: "/homeVideos/vid4.mp4",
    meta: "3D • Hook",
  },
  {
    id: 5,
    title: "Product Demo Ad",
    description: "Shows the product working before the pitch starts.",
    videoSrc: "/homeVideos/vid5.mp4",
    meta: "Demo • Convert",
  },
];

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function WorkSection() {
  const [active, setActive] = React.useState(0);
  const videoRefs = React.useRef<Record<number, HTMLVideoElement | null>>({});
  const [playing, setPlaying] = React.useState(true);
  const [muted, setMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [direction, setDirection] = React.useState(0);
  const wasPlayingRef = React.useRef(true);
  const [showOverlayIcon, setShowOverlayIcon] = React.useState<
    "play" | "pause" | null
  >(null);
  const isMobile = useIsMobile();

  const count = WORK_ITEMS.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = WORK_ITEMS[activeIndex];
  const [showControls, setShowControls] = React.useState(false);
  const isScrubbingRef = React.useRef(false);

  React.useEffect(() => {
    const refs = videoRefs.current;
    const activeId = WORK_ITEMS[activeIndex].id;
    const activeVideo = refs[activeId];

    if (!activeVideo) return;
    if (!activeVideo.src) {
      activeVideo.src = WORK_ITEMS[activeIndex].videoSrc;
      activeVideo.load();
    }
    setProgress(0);
    Object.entries(refs).forEach(([id, video]) => {
      if (!video) return;

      const index = WORK_ITEMS.findIndex((i) => i.id === Number(id));
      const distance = Math.abs(index - activeIndex);
      if (distance >= 1) video.pause();
      if (distance > 1) {
        video.removeAttribute("src");
        video.load();
      }
    });

    const playVideo = () => {
      activeVideo.muted = muted;
      activeVideo
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setPlaying(false);
        });
    };

    if (activeVideo.readyState >= 2) {
      playVideo();
    } else {
      activeVideo.addEventListener("loadeddata", playVideo, { once: true });
    }

    const handleTimeUpdate = () => {
      if (!activeVideo.duration || isScrubbingRef.current) return;
      const value = (activeVideo.currentTime / activeVideo.duration) * 100;
      setProgress(value);
    };

    const handleEnd = () => {
      setTimeout(() => {
        setActive((prev) => prev + 1);
      }, 150);
    };

    activeVideo.addEventListener("timeupdate", handleTimeUpdate);
    activeVideo.addEventListener("ended", handleEnd);

    return () => {
      activeVideo.removeEventListener("timeupdate", handleTimeUpdate);
      activeVideo.removeEventListener("ended", handleEnd);
    };
  }, [activeIndex, muted]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const video = videoRefs.current[WORK_ITEMS[activeIndex].id];
      if (!video) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (video.paused) {
          video.play();
          setPlaying(true);
          setShowOverlayIcon("play");
        } else {
          video.pause();
          setPlaying(false);
          setShowOverlayIcon("pause");
        }
        setTimeout(() => setShowOverlayIcon(null), 500);
      }

      if (e.key === "ArrowRight") setActive((p) => p + 1);
      if (e.key === "ArrowLeft") setActive((p) => p - 1);

      if (e.key.toLowerCase() === "m") {
        setMuted((prev) => {
          const next = !prev;
          Object.values(videoRefs.current).forEach((vid) => {
            if (vid) vid.muted = next;
          });
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, muted]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRefs.current[WORK_ITEMS[activeIndex].id];
        if (!video) return;
        if (!entry.isIntersecting) {
          wasPlayingRef.current = !video.paused;
          video.pause();
          setPlaying(false);
        } else {
          if (wasPlayingRef.current) {
            video
              .play()
              .then(() => setPlaying(true))
              .catch(() => setPlaying(false));
          }
        }
      },
      { threshold: isMobile ? 0.6 : 0.4 },
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [activeIndex, muted]);

  const handleNext = () => {
    setDirection(1);
    setActive((p) => p + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActive((p) => p - 1);
  };

  const visible = isMobile ? [-1, 0, 1] : [-2, -1, 0, 1, 2];

  return (
    <section className="section-padding overflow-hidden">
      <div className="container-tight">
        <div className="text-center mb-[8vh]">
          <span className="tag">Work</span>
          <h2 className="heading">Videos We Worked On</h2>
          <p className="desc">
            This isn&apos;t guesswork. These are real ads built to stop scroll,
            hold attention, and drive revenue across paid channels.
          </p>
        </div>

        {/* CAROUSEL */}
        <div
          ref={containerRef}
          className="relative flex flex-col items-center gap-10"
        >
          <div
            className="relative h-105 w-full max-w-5xl flex items-center justify-center"
            style={{ perspective: "2000px" }}
          >
            {visible.map((offset) => {
              const index = wrap(0, count, active + offset);
              const item = WORK_ITEMS[index];
              const isCenter = offset === 0;
              const dist = Math.abs(offset);

              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{
                    x:
                      offset * 290 -
                      Math.sign(offset) * (Math.abs(offset) === 2 ? 40 : 0),
                    scale: isCenter ? 1 : dist === 1 ? 0.85 : 0.75,
                    rotateY: isMobile
                      ? 0
                      : isCenter
                        ? 0
                        : Math.sign(offset) * -15,
                    zIndex: 10 - dist,
                    opacity: isCenter ? 1 : dist === 1 ? 0.8 : 0.4,
                    filter: isMobile
                      ? "none"
                      : isCenter
                        ? "blur(0px) brightness(1)"
                        : `blur(${dist * 4}px) brightness(0.6)`,
                  }}
                  transition={{
                    layout: { duration: 0.4, ease: "easeInOut" },
                    type: isMobile ? "tween" : "spring",
                    duration: isMobile ? 0.25 : undefined,
                    stiffness: 300,
                    damping: 23,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className=" group absolute w-75 aspect-9/16 rounded-xl overflow-hidden bg-black border-3 border-white/50"
                  onClick={(e) => {
                    if (!isCenter) {
                      setActive((p) => p + Math.sign(offset));
                      return;
                    }

                    const v = videoRefs.current[item.id];
                    if (!v) return;

                    if (v.paused) {
                      v.play();
                      setPlaying(true);
                      setShowOverlayIcon("play");
                      if (isMobile) setShowControls(false);
                    } else {
                      v.pause();
                      setPlaying(false);
                      setShowOverlayIcon("pause");
                      if (isMobile) setShowControls(true);
                    }
                    setTimeout(() => setShowOverlayIcon(null), 500);
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0}
                  dragMomentum={false}
                  onDrag={(e, info) => {
                    info.point.x = 0;
                  }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -20) {
                      handleNext();
                    } else if (info.offset.x > 20) {
                      handlePrev();
                    }
                  }}
                  onTouchStart={() => {
                    if (isMobile) setShowControls(true);
                  }}
                >
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[item.id] = el;
                    }}
                    src={Math.abs(offset) <= 1 ? item.videoSrc : undefined}
                    poster={`/thumbnails/thumb${item.id}.webp`}
                    muted
                    playsInline
                    preload={
                      offset === 0
                        ? "auto"
                        : Math.abs(offset) === 1
                          ? "metadata"
                          : "none"
                    }
                    className="w-full h-full object-cover"
                  />
                  <AnimatePresence>
                    {isCenter && showOverlayIcon && (
                      <motion.div
                        key={showOverlayIcon}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="bg-black/60 rounded-full p-4 backdrop-blur-md">
                          {showOverlayIcon === "play" ? (
                            <Play className="h-8 w-8 text-white" />
                          ) : (
                            <Pause className="h-8 w-8 text-white" />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CONTROLS (only center) */}
                  {isCenter && (
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isMobile ? (!playing ? 1 : 0) : 1,
                        y: isMobile ? (!playing ? 0 : 10) : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`
                                    absolute bottom-3 left-3 right-3 flex items-center gap-3
                                    bg-black/70 rounded-xl px-4 py-3 backdrop-blur-md
                                    transition-all duration-300
                                    ${
                                      isMobile
                                        ? ""
                                        : "opacity-0 translate-y-20 group-hover:opacity-100 group-hover:translate-y-0"
                                    }
                                `}
                    >
                      {/* Timeline */}
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={progress}
                        className="flex-1 h-0.5 accent-(--brand) cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                        onInput={(e) => {
                          const v = videoRefs.current[item.id];
                          if (!v) return;

                          const val = Number(
                            (e.target as HTMLInputElement).value,
                          );
                          v.currentTime = (val / 100) * v.duration;
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          isScrubbingRef.current = true;

                          const v = videoRefs.current[item.id];
                          if (!v) return;
                          v.pause();
                        }}
                        onPointerUp={(e) => {
                          e.stopPropagation();
                          isScrubbingRef.current = false;

                          const v = videoRefs.current[item.id];
                          if (!v) return;
                          v.play().catch(() => {});
                        }}
                      />

                      {/* Mute */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMuted((prev) => {
                            const next = !prev;
                            Object.values(videoRefs.current).forEach((vid) => {
                              if (vid) vid.muted = next;
                            });
                            return next;
                          });
                        }}
                        className="p-2"
                        aria-label={muted ? "Unmute" : "Mute"}
                      >
                        {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* INFO + CONTROLS */}
          <div className="mx-auto mt-3 md:mt-12 flex w-full max-w-5xl flex-col items-center md:gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left min-h-25 md:min-h-27.5 justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-0 md:space-y-2"
                >
                  {activeItem.meta && (
                    <span className="tag">{activeItem.meta}</span>
                  )}

                  <h3 className="text-2xl md:text-[0.8vw] font-bold text-white tracking-tight">
                    {activeItem.title}
                  </h3>

                  <p className="max-w-md text-sm md:text-[0.8vw] text-neutral-400">
                    {activeItem.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-row items-center gap-4 md:gap-6">
              {/* Skin lives in globals.css alongside .tag / .heading / .desc,
                  so it shares the secondary button's tokens instead of
                  restating them here. */}
              <div className="carousel-nav">
                <button onClick={handlePrev} aria-label="Previous video">
                  <ChevronLeft className="h-[1.15em] w-[1.15em]" />
                </button>
                <span className="carousel-count">
                  {activeIndex + 1} / {count}
                </span>
                <button onClick={handleNext} aria-label="Next video">
                  <ChevronRight className="h-[1.15em] w-[1.15em]" />
                </button>
              </div>
              {/* Same component as the approach and case-studies CTAs, so this
                  inherits buttonBase's sizing instead of restating it in
                  Tailwind and drifting from every other button on the page. */}
              <SecondaryButton href="/work">
                <span>Explore Work</span>
                <ArrowUpRight className="w-[1.25em] h-[1.25em]" />
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
