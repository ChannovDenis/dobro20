import { useRef, useState, useEffect } from "react";
import { feedItems } from "@/data/mockData";
import { FeedCard } from "./FeedCard";
import { PromoCard } from "./PromoCard";

export function TikTokFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] overflow-y-scroll snap-y snap-mandatory no-scrollbar"
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
