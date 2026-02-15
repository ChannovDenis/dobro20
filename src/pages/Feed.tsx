import { TikTokFeed } from "@/components/feed/TikTokFeed";
import { BottomNav } from "@/components/layout/BottomNav";

export default function Feed() {
  return (
    <div className="relative h-[100dvh] bg-background overflow-hidden">
      <TikTokFeed />
      <BottomNav />
    </div>
  );
}
