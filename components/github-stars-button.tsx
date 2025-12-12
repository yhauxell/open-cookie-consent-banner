"use client";

import { Button } from "@/components/ui/button";
import { Github, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface GitHubStarsButtonProps {
  githubUrl: string;
  className?: string;
}

export function GitHubStarsButton({
  githubUrl,
  className,
}: GitHubStarsButtonProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch only once on component mount (page load)
    async function fetchStars() {
      try {
        const response = await fetch("/api/github/stars", {
          cache: "force-cache", // Use cached version if available
        });
        if (response.ok) {
          const data = await response.json();
          setStars(data.stars);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStars();
    // Empty dependency array ensures this runs only once on mount
  }, []);

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className={`shrink-0 gap-2 hover:bg-accent hover:border-primary transition-all group ${className}`}
    >
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:flex items-center gap-1.5 font-medium">
          {isLoading ? (
            "Loading..."
          ) : stars !== null && stars > 0 ? (
            <>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {stars.toLocaleString()}
            </>
          ) : (
            "Star on GitHub"
          )}
        </span>
        <span className="sm:hidden font-medium">GitHub</span>
      </a>
    </Button>
  );
}
