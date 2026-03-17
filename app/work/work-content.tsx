"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useRef, useState } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

const workVideos = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  {
    id: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  },
  {
    id: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
];

interface VideoCardProps {
  thumbnail: string;
  videoUrl: string;
  className?: string;
}

function VideoCard({ thumbnail, videoUrl, className = "" }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <GlowCard className={`overflow-hidden ${className}`}>
      <div
        className="relative aspect-video cursor-pointer "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={thumbnail || "/placeholder.svg"}
          alt="Video thumbnail"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
        />
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </GlowCard>
  );
}

export function WorkPageContent() {
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

        {/* Bento Grid */}
        <section className="section-padding pt-0">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Large left */}
              <div className="col-span-2 row-span-2">
                <VideoCard {...workVideos[0]} className="h-full" />
              </div>

              {/* Top right small */}
              <div className="col-span-1">
                <VideoCard {...workVideos[1]} />
              </div>

              {/* Top right small */}
              <div className="col-span-1">
                <VideoCard {...workVideos[2]} />
              </div>

              {/* Bottom right wide */}
              <div className="col-span-2 row-span-2">
                <VideoCard {...workVideos[3]} />
              </div>

              {/* Second row - small items */}
              <div className="col-span-1">
                <VideoCard {...workVideos[4]} />
              </div>

              <div className="col-span-1">
                <VideoCard {...workVideos[5]} />
              </div>

              <div className="col-span-2">
                <VideoCard {...workVideos[6]} />
              </div>

              {/* Full width bottom */}
              <div className="col-span-2">
                <VideoCard {...workVideos[7]} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
