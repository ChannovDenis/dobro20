import { useState, useCallback } from "react";
import { TikTokFeed } from "@/components/feed/TikTokFeed";
import { BottomNav } from "@/components/layout/BottomNav";
import { FeedItem } from "@/data/mockData";

export interface ActiveFeedContext {
  title: string;
  tags: string[];
}

export default function Feed() {
  const [activeFeedItem, setActiveFeedItem] = useState<ActiveFeedContext | null>(null);

  const handleActiveItemChange = useCallback((item: FeedItem) => {
    setActiveFeedItem({
      title: item.title,
      tags: item.tags,
    });
  }, []);

  return (
    <div className="relative h-[100dvh] bg-background overflow-hidden">
      <TikTokFeed onActiveItemChange={handleActiveItemChange} />
      <BottomNav activeFeedItem={activeFeedItem} />
    </div>
  );
}
