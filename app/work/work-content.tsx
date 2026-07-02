"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";
import { useIsMobile } from "@/hooks/use-isMobile";

type VideoEntry = {
  thumbnail: string;
  previewVideoUrl: string;
  fullVideoUrl: string;
};

// Grid order: [0]=h1(landscape) [1]=v1 [2]=v2 [3]=h2(landscape) [4-15]=v3-v14
const workVideos: VideoEntry[] = [
  { thumbnail: "/work/thumbnails/h1.webp", previewVideoUrl: "/work/previews/h1.mp4", fullVideoUrl: "/work/full/h1.mp4" },
  { thumbnail: "/work/thumbnails/v1.webp", previewVideoUrl: "/work/previews/v1.mp4", fullVideoUrl: "/work/full/v1.mp4" },
  { thumbnail: "/work/thumbnails/v2.webp", previewVideoUrl: "/work/previews/v2.mp4", fullVideoUrl: "/work/full/v2.mp4" },
  { thumbnail: "/work/thumbnails/h2.webp", previewVideoUrl: "/work/previews/h2.mp4", fullVideoUrl: "/work/full/h2.mp4" },
  { thumbnail: "/work/thumbnails/v3.webp", previewVideoUrl: "/work/previews/v3.mp4", fullVideoUrl: "/work/full/v3.mp4" },
  { thumbnail: "/work/thumbnails/v4.webp", previewVideoUrl: "/work/previews/v4.mp4", fullVideoUrl: "/work/full/v4.mp4" },
  { thumbnail: "/work/thumbnails/v5.webp", previewVideoUrl: "/work/previews/v5.mp4", fullVideoUrl: "/work/full/v5.mp4" },
  { thumbnail: "/work/thumbnails/v6.webp", previewVideoUrl: "/work/previews/v6.mp4", fullVideoUrl: "/work/full/v6.mp4" },
  { thumbnail: "/work/thumbnails/v7.webp", previewVideoUrl: "/work/previews/v7.mp4", fullVideoUrl: "/work/full/v7.mp4" },
  { thumbnail: "/work/thumbnails/v8.webp", previewVideoUrl: "/work/previews/v8.mp4", fullVideoUrl: "/work/full/v8.mp4" },
  { thumbnail: "/work/thumbnails/v9.webp", previewVideoUrl: "/work/previews/v9.mp4", fullVideoUrl: "/work/full/v9.mp4" },
  { thumbnail: "/work/thumbnails/v10.webp", previewVideoUrl: "/work/previews/v10.mp4", fullVideoUrl: "/work/full/v10.mp4" },
  { thumbnail: "/work/thumbnails/v11.webp", previewVideoUrl: "/work/previews/v11.mp4", fullVideoUrl: "/work/full/v11.mp4" },
  { thumbnail: "/work/thumbnails/v12.webp", previewVideoUrl: "/work/previews/v12.mp4", fullVideoUrl: "/work/full/v12.mp4" },
  { thumbnail: "/work/thumbnails/v13.webp", previewVideoUrl: "/work/previews/v13.mp4", fullVideoUrl: "/work/full/v13.mp4" },
  { thumbnail: "/work/thumbnails/v14.webp", previewVideoUrl: "/work/previews/v14.mp4", fullVideoUrl: "/work/full/v14.mp4" },
];

type ActiveVideo = { url: string; aspect: "landscape" | "portrait" };

interface VideoCardProps {
  thumbnail: string;
  previewVideoUrl: string;
  fullVideoUrl: string;
  className?: string;
  aspect?: "landscape" | "portrait";
  isMobile: boolean | null;
  onOpen: (video: ActiveVideo) => void;
}

function VideoCard({
  thumbnail,
  previewVideoUrl,
  fullVideoUrl,
  className = "",
  aspect = "portrait",
  isMobile,
  onOpen,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [hasMountedVideo, setHasMountedVideo] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [showClickPopup, setShowClickPopup] = useState(false);

  const stopPreview = () => {
    setIsPreviewVisible(false);
    setIsLoadingPreview(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setShowClickPopup(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const triggerPreview = () => {
    setIsPreviewVisible(true);

    if (!hasMountedVideo) {
      setHasMountedVideo(true);
      setIsLoadingPreview(true);
      return;
    }

    if (!isPreviewReady) {
      setIsLoadingPreview(true);
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    triggerPreview();

    hoverTimerRef.current = setTimeout(() => {
      setShowClickPopup(true);
      popupTimerRef.current = setTimeout(() => {
        setShowClickPopup(false);
      }, 3000);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    stopPreview();
  };

  const handleClick = () => {
    onOpen({ url: fullVideoUrl, aspect });
  };

  const handleVideoLoaded = () => {
    setIsPreviewReady(true);
    setIsLoadingPreview(false);

    if (isPreviewVisible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (!hasMountedVideo || !videoRef.current) return;
    videoRef.current.load();
  }, [hasMountedVideo]);

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerPreview();
        } else {
          stopPreview();
        }
      },
      { threshold: 0.55 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, hasMountedVideo, isPreviewReady]);

  return (
    <GlowCard className={`overflow-hidden h-full ${className}`}>
      <div
        ref={containerRef}
        className={`group relative cursor-pointer h-full overflow-hidden w-full ${
          aspect === "landscape" ? "aspect-[16/7.8]" : "aspect-[4/6.2]"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <Image
          src={thumbnail}
          alt="Video thumbnail"
          fill
          className={`object-cover object-center transition-opacity duration-300 ${
            isPreviewVisible && isPreviewReady ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Preview Video */}
        {hasMountedVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            onLoadedData={handleVideoLoaded}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
              isPreviewVisible && isPreviewReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={previewVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* Loading Overlay */}
        {isPreviewVisible && isLoadingPreview && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
            <div className="absolute inset-0 animate-pulse bg-white/5" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
          </div>
        )}

        {/* Play Icon */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
            isPreviewVisible ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
              aspect === "landscape"
                ? "w-14 h-14 md:w-16 md:h-16"
                : "w-11 h-11 md:w-12 md:h-12"
            }`}
          >
            <div
              className={`ml-1 w-0 h-0 border-t-transparent border-b-transparent border-l-white ${
                aspect === "landscape"
                  ? "border-t-[9px] border-b-[9px] border-l-14"
                  : "border-t-8 border-b-8 border-l-12"
              }`}
            />
          </div>
        </div>

        {/* Hover popup — appears after 5s, stays 3s */}
        <AnimatePresence>
          {showClickPopup && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 z-30 rounded-b-xl bg-black/85 px-4 py-3 text-center text-sm font-medium text-white backdrop-blur-sm pointer-events-none"
            >
              Click to watch full video with sound
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlowCard>
  );
}

interface VideoModalProps {
  video: ActiveVideo | null;
  onClose: () => void;
}

function VideoModal({ video, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [video, onClose]);

  useEffect(() => {
    if (videoRef.current && video) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  if (!video) return null;

  const isPortrait = video.aspect === "portrait";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className={`relative ${isPortrait ? "h-[85vh]" : "w-full max-w-5xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-3xl leading-none text-white transition hover:opacity-80"
        >
          ×
        </button>

        <div
          className={`relative overflow-hidden rounded-2xl bg-black ${
            isPortrait ? "h-full aspect-9/16" : "w-full aspect-video"
          }`}
        >
          <video
            ref={videoRef}
            src={video.url}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        </div>
      </div>
    </div>
  );
}

export function WorkPageContent() {
  const isMobile = useIsMobile();
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* Hero */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="tag">Our Work</span>
              <h1 className="heading">Performance Video Ads That Drive Revenue</h1>
              <p className="desc">
                Browse video ads we've created for DTC brands scaling on Facebook, TikTok, and YouTube.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Videos */}
        <section className="section-padding pt-0">
          <div className="container-tight">

            {/* Mobile — linear stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 md:hidden"
            >
              {workVideos.map((video, i) => (
                <VideoCard
                  key={i}
                  {...video}
                  aspect={i === 0 || i === 3 ? "landscape" : "portrait"}
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              ))}
            </motion.div>

            {/* Desktop Bento */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="hidden md:grid grid-cols-3 gap-4 md:gap-5 auto-rows-auto"
            >
              {/* Row 1: H V */}
              <div className="col-span-2">
                <VideoCard {...workVideos[0]} aspect="landscape" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[1]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>

              {/* Row 2: V H */}
              <div className="col-span-1">
                <VideoCard {...workVideos[2]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-2">
                <VideoCard {...workVideos[3]} aspect="landscape" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>

              {/* Row 3: V V V */}
              <div className="col-span-1">
                <VideoCard {...workVideos[4]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[5]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[6]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>

              {/* Row 4: V V V */}
              <div className="col-span-1">
                <VideoCard {...workVideos[7]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[8]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[9]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>

              {/* Row 5: V V V */}
              <div className="col-span-1">
                <VideoCard {...workVideos[10]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[11]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[12]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>

              {/* Row 6: V V V */}
              <div className="col-span-1">
                <VideoCard {...workVideos[13]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[14]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
              <div className="col-span-1">
                <VideoCard {...workVideos[15]} aspect="portrait" isMobile={isMobile} onOpen={setActiveVideo} />
              </div>
            </motion.div>

          </div>
        </section>

        <CTASection />
      </div>

      <Footer />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </main>
  );
}
