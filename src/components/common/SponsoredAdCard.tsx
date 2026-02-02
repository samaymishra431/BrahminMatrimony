import { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

type AdItem = {
  id: number;
  title: string;
  description: string;
  mediaType: "image" | "video" | "IMAGE" | "VIDEO";
  mediaUrl: string;
  ctaText: string;
  ctaUrl?: string;
};

const SponsoredAdsCarousel = () => {
  const [ads, setAds] = useState<AdItem[]>([]);
  const objectUrlsRef = useRef<string[]>([]);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [
      Autoplay({
        delay: 3000, // 3 seconds
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  useEffect(() => {
    let isMounted = true;
    const fetchAds = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const res = await fetch(`${baseUrl}/api/sponsored-ads/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.statusCode === 200 && Array.isArray(data.payload)) {
            const adsData = data.payload;
            if (adsData.length === 0) return;

            const fetchMedia = async (ad: any) => {
              try {
                const mediaRes = await fetch(
                  `${baseUrl}/api/sponsored-ads/media/${ad.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (mediaRes.ok) {
                  const blob = await mediaRes.blob();
                  const objectUrl = URL.createObjectURL(blob);
                  objectUrlsRef.current.push(objectUrl);
                  return { ...ad, mediaUrl: objectUrl };
                }
              } catch (err) {
                console.error(`Error fetching media for ad ${ad.id}`, err);
              }
              return ad;
            };

            // Fetch first ad media immediately
            const firstAdWithMedia = await fetchMedia(adsData[0]);
            if (!isMounted) return;

            // Show first ad immediately, others will load sequentially
            // Clear mediaUrl for pending ads to prevent "Not allowed to load local resource" errors
            const pendingAds = adsData.slice(1).map((ad: any) => ({ ...ad, mediaUrl: "" }));
            setAds([firstAdWithMedia, ...pendingAds]);

            // Fetch remaining ads one by one
            for (let i = 1; i < adsData.length; i++) {
              if (!isMounted) break;
              const adWithMedia = await fetchMedia(adsData[i]);
              setAds((prev) => prev.map((ad, index) => (index === i ? adWithMedia : ad)));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching sponsored ads:", error);
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  if (ads.length === 0) return null;

  return (
    <Card className="border-0 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Sponsored
        </span>
      </div>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden px-3 pb-4">
        <div className="flex -ml-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="
                flex-shrink-0
                pl-4
                basis-full md:basis-1/2 lg:basis-1/3
              "
            >
              {/* Banner Card */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black">
                {/* Media */}
                {ad.mediaUrl &&
                  (["video", "VIDEO"].includes(ad.mediaType) ? (
                    <video
                      src={ad.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={ad.mediaUrl}
                      alt={ad.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <h4 className="text-sm font-semibold leading-tight">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-1">
                    {ad.description}
                  </p>

                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs bg-gradient-primary"
                    onClick={() => ad.ctaUrl && window.open(ad.ctaUrl, "_blank")}
                  >
                    {["video", "VIDEO"].includes(ad.mediaType) && (
                      <PlayCircle className="w-3 h-3 mr-1" />
                    )}
                    {ad.ctaText}
                  </Button>
                </div>

                {/* Sponsored badge */}
                <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                  Sponsored
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SponsoredAdsCarousel;
