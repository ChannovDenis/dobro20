import { useRef, useState, useEffect } from "react";
import { FeedItem } from "@/data/mockData";
import { useFeed } from "@/hooks/useFeed";
import { FeedCard } from "./FeedCard";
import { PromoCard } from "./PromoCard";

interface TikTokFeedProps {
  onActiveItemChange?: (item: FeedItem) => void;
}

export function TikTokFeed({ onActiveItemChange }: TikTokFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { feedItems } = useFeed();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const cardHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / cardHeight);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Notify parent when active item changes
  useEffect(() => {
    if (onActiveItemChange && feedItems[activeIndex]) {
      onActiveItemChange(feedItems[activeIndex]);
    }
  }, [activeIndex, onActiveItemChange, feedItems]);

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] pb-20 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
    >
      {feedItems.map((item, index) => {
        const isPromo = item.type === "service-promo" || item.type === "miniapp-promo";
        const isActive = index === activeIndex;

        return isPromo ? (
          <PromoCard key={item.id} item={item} isActive={isActive} />
        ) : (
          <FeedCard key={item.id} item={item} isActive={isActive} />
        );
      })}
    </div>
  );
}
