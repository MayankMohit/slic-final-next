"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";
import { useIsMobile } from "@/hooks/use-isMobile";

const workVideos = [
  {
    id: 1,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 2,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 3,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 4,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 5,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 6,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 7,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
  {
    id: 8,
    thumbnail: "/work/ad1-thumb.webp",
    previewVideoUrl: "/work/ad1-preview.mp4",
    fullVideoUrl: "/work/ad1-full.mp4",
  },
];

interface VideoCardProps {
  thumbnail: string;
  previewVideoUrl: string;
  fullVideoUrl: string;
  className?: string;
  aspect?: "landscape" | "portrait";
  isMobile: boolean | null;
  onOpen: (videoUrl: string) => void;
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

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [hasMountedVideo, setHasMountedVideo] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  const stopPreview = () => {
    setIsPreviewVisible(false);
    setIsLoadingPreview(false);

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
      videoRef.current.play().catch((err) => {
        console.log("Preview play failed:", err);
      });
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    triggerPreview();
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    stopPreview();
  };

  const handleClick = () => {
    onOpen(fullVideoUrl);
  };

  const handleVideoLoaded = () => {
    setIsPreviewReady(true);
    setIsLoadingPreview(false);

    if (isPreviewVisible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.log("Autoplay after load failed:", err);
      });
    }
  };

  // IMPORTANT: once video element mounts, force browser to begin loading it
  useEffect(() => {
    if (!hasMountedVideo || !videoRef.current) return;

    videoRef.current.load();
  }, [hasMountedVideo]);

  // Mobile autoplay when card is in view
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
      {
        threshold: 0.55,
      },
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
        <img
          src={thumbnail}
          style={{ objectPosition: "center center" }}
          alt="Video thumbnail"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
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
      </div>
    </GlowCard>
  );
}

interface VideoModalProps {
  videoUrl: string | null;
  onClose: () => void;
}

function VideoModal({ videoUrl, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoUrl) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [videoUrl, onClose]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div
      className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-3xl leading-none hover:opacity-80 transition"
        >
          ×
        </button>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
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
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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

              <h1 className="heading">
                Performance Video Ads That Drive Revenue
              </h1>

              <p className="desc">
                Browse video ads we've created for DTC brands scaling on
                Facebook, TikTok, and YouTube.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid */}
        {/* Work Videos */}
        <section className="section-padding pt-0">
          <div className="container-tight">
            {/* Mobile Linear Layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 md:hidden"
            >
              <VideoCard
                {...workVideos[0]}
                aspect="landscape"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[1]}
                aspect="portrait"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[2]}
                aspect="portrait"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[3]}
                aspect="landscape"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[4]}
                aspect="portrait"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[5]}
                aspect="portrait"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[6]}
                aspect="portrait"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
              <VideoCard
                {...workVideos[7]}
                aspect="portrait"
                isMobile={isMobile}
                onOpen={setActiveVideo}
              />
            </motion.div>

            {/* Desktop Bento Layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="hidden md:grid grid-cols-3 gap-4 md:gap-5 auto-rows-auto"
            >
              {/* Row 1 */}
              <div className="col-span-2">
                <VideoCard
                  {...workVideos[0]}
                  aspect="landscape"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[1]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>

              {/* Row 2 */}
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[2]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-2">
                <VideoCard
                  {...workVideos[3]}
                  aspect="landscape"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>

              {/* Row 3 */}
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[4]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[5]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[6]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>

              {/* Row 4 */}
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[7]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[0]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[1]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>

              {/* Row 5 */}
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[2]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[3]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
              <div className="col-span-1">
                <VideoCard
                  {...workVideos[4]}
                  aspect="portrait"
                  isMobile={isMobile}
                  onOpen={setActiveVideo}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </div>

      <Footer />

      <VideoModal videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />
    </main>
  );
}
