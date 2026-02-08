import { motion } from "framer-motion";
import { TopBar } from "@/components/layout/TopBar";
import { SearchBar } from "@/components/layout/SearchBar";
import { AiAssistantCard } from "@/components/feed/AiAssistantCard";
import { ServiceGrid } from "@/components/feed/ServiceGrid";
import { MiniAppsScroll } from "@/components/feed/MiniAppsScroll";
import { ContentFeed } from "@/components/feed/ContentFeed";
import { BottomNav } from "@/components/layout/BottomNav";

export default function Feed() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-4"
      >
        <SearchBar />
        <AiAssistantCard />
        <ServiceGrid />
        <MiniAppsScroll />
        <ContentFeed />
      </motion.main>

      <BottomNav />
    </div>
  );
}
