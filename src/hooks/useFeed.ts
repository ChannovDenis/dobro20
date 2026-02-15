import { useState, useEffect, useMemo } from "react";
import { feedItems as mockFeedItems, FeedItem } from "@/data/mockData";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";

interface DBFeedItem {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  author_name: string | null;
  author_avatar: string | null;
  type: string;
  target_service: string | null;
  target_prompt: string | null;
  is_published: boolean;
  published_at: string | null;
  sort_order: number | null;
  created_at: string | null;
}

/**
 * Map a DB feed item to the local FeedItem interface used by TikTokFeed.
 */
function dbItemToLocal(item: DBFeedItem): FeedItem {
  return {
    id: item.id,
    type: (item.type as FeedItem["type"]) || "content",
    title: item.title,
    description: item.description || "",
    image: item.image_url || "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=1400&fit=crop",
    video: item.video_url || undefined,
    tags: item.tags || [],
    author: item.author_name || undefined,
    authorAvatar: item.author_avatar || undefined,
    likes: 0,
    comments: 0,
    shares: 0,
    serviceId: item.target_service || undefined,
    ctaText: item.target_prompt || undefined,
  };
}

/**
 * Feed scoring: tenant-specific items first, then generic, sorted by time.
 */
function scoreFeedItems(
  dbItems: FeedItem[],
  localItems: FeedItem[],
  _tenantSlug: string | null
): FeedItem[] {
  // If we have DB items for this tenant, show them first, then append mock items
  if (dbItems.length > 0) {
    // De-duplicate by id — DB items take priority
    const dbIds = new Set(dbItems.map((i) => i.id));
    const uniqueLocal = localItems.filter((i) => !dbIds.has(i.id));
    return [...dbItems, ...uniqueLocal];
  }

  // No DB items — use all mock items
  return localItems;
}

export function useFeed() {
  const { tenantSlug } = useTenant();
  const [dbItems, setDbItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Normalize slug: 'default' maps to 'dobro' in DB
        const dbSlug = tenantSlug === "default" || !tenantSlug ? "dobro" : tenantSlug;

        const { data, error: fetchError } = await supabase
          .from("feed_items")
          .select("*")
          .or(`tenant_id.eq.${dbSlug},tenant_id.eq.dobro`)
          .eq("is_published", true)
          .order("sort_order", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.warn("Feed fetch error, using mock data:", fetchError.message);
          setDbItems([]);
        } else if (data && data.length > 0) {
          // Tenant-specific items first, then generic (dobro)
          const tenantItems = data.filter((i: DBFeedItem) => i.tenant_id === dbSlug);
          const genericItems = data.filter((i: DBFeedItem) => i.tenant_id === "dobro" && dbSlug !== "dobro");
          const mapped = [...tenantItems, ...genericItems].map(dbItemToLocal);
          setDbItems(mapped);
        } else {
          setDbItems([]);
        }
      } catch (err) {
        console.warn("Feed fetch failed, using mock data:", err);
        setError("Failed to load feed");
        setDbItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [tenantSlug]);

  const feedItems = useMemo(
    () => scoreFeedItems(dbItems, mockFeedItems, tenantSlug),
    [dbItems, tenantSlug]
  );

  return {
    feedItems,
    isLoading,
    error,
  };
}
