import { motion } from "framer-motion";
import { Heart, Share2, Volume2, VolumeX } from "lucide-react";
import { FeedItem } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";

interface FeedCardProps {
  item: FeedItem;
  isActive: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function FeedCard({ item, isActive }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video autoplay based on active state
  useEffect(() => {
    if (!videoRef.current || !item.video) return;
    
    if (isActive) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, likely due to browser policy
        console.log("Autoplay prevented");
      });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, item.video]);

  const hasVideo = !!item.video;

  return (
    <div className="relative h-[100dvh] w-full snap-start snap-always flex-shrink-0">
      {/* Background Media */}
      <div className="absolute inset-0">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.image}
            loop
            muted={muted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent h-32" />
      </div>

      {/* Video mute toggle */}
      {hasVideo && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          onClick={() => setMuted(!muted)}
          className="absolute top-20 right-4 p-3 rounded-full glass z-10"
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </motion.button>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24 px-4">
        {/* Video indicator */}
        {hasVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            className="absolute top-20 left-4"
          >
            <span className="px-2 py-1 text-xs font-bold rounded glass text-primary">
              ВИДЕО
            </span>
          </motion.div>
        )}

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-3"
        >
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full glass"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title and description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="max-w-[85%]"
        >
          <h2 className="text-xl font-bold text-foreground mb-2 leading-tight">
            {item.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </motion.div>

        {/* Author */}
        {item.author && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-4"
          >
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src={item.authorAvatar} alt={item.author} />
              <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {item.author}
            </span>
          </motion.div>
        )}
      </div>

      {/* Minimal right side actions - only Like and Share */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 0.4 }}
        className="absolute right-4 bottom-32 flex flex-col items-center gap-4"
      >
        <button
          onClick={() => setLiked(!liked)}
          className={`p-2.5 rounded-full glass/60 backdrop-blur-sm ${liked ? "text-destructive" : "text-foreground/80"}`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
        </button>

        <button className="p-2.5 rounded-full glass/60 backdrop-blur-sm text-foreground/80">
          <Share2 className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
