"use client";

import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

const WIKI_URL = "https://fixer.miraheze.org/wiki/";

interface WikiLinkProps {
  wikiPage: WikiLinks;
  full?: boolean;
}

export enum WikiLinks {
  CHARACTER = "Character",
}

export function WikiLink({ wikiPage, full = false }: WikiLinkProps) {
  const [error, setError] = useState<string | null>(null);

  const handleWikiClick = () => {
    try {
      const encodedWikiPage = encodeURIComponent(wikiPage.replace(/ /g, "_"));
      const fullWikiUrl = `${WIKI_URL}${encodedWikiPage}`;
      window.open(fullWikiUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError("Failed to open wiki page");
      console.error("Error opening wiki page:", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 px-2"
            onClick={handleWikiClick}
            aria-label={`Open wiki page for ${wikiPage}`}
          >
            <ExternalLink size={16} className="text-primary mr-2" />
            {full && <span>View {wikiPage} on Wiki</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{error || `View ${wikiPage} on Wiki`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
