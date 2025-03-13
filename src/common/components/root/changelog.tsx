import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface ChangelogEntry {
  version: string;
  date?: string;
  changes: Record<string, string[]>; // Flexible structure for any section type
}

interface Changelog {
  unreleased?: ChangelogEntry;
  releases: ChangelogEntry[];
}

const ChangelogComponent: React.FC = () => {
  const [changelog, setChangelog] = useState<Changelog | null>(null);

  const gameBuildVersion = import.meta.env.VITE_GAME_BUILD_VERSION;

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/Pazdikan/fixer/refs/heads/dev/CHANGELOG.md"
        );
        console.log(response.data);

        const parsedChangelog = parseChangelog(response.data);
        setChangelog(parsedChangelog);
      } catch (error) {
        console.error("Error fetching changelog:", error);
      }
    };

    fetchChangelog();
  }, []);

  const parseChangelog = (markdown: string): Changelog => {
    const lines = markdown.split("\n");
    const changelog: Changelog = { releases: [] };
    let currentEntry: ChangelogEntry | null = null;
    let currentSection: string | null = null;

    lines.forEach((line) => {
      const unreleasedMatch = line.match(/## \[Unreleased\]/);
      const versionMatch = line.match(/## \[(\d+\.\d+\.\d+)\] - (.+)/);
      const sectionMatch = line.match(/### ([\w\s]+)/);

      if (unreleasedMatch) {
        currentEntry = { version: "Unreleased", changes: {} };
        changelog.unreleased = currentEntry;
      } else if (versionMatch) {
        currentEntry = {
          version: versionMatch[1],
          date: versionMatch[2].trim(), // Capture the date or release name
          changes: {},
        };
        changelog.releases.push(currentEntry);
      } else if (sectionMatch && currentEntry) {
        currentSection = sectionMatch[1].toLowerCase(); // Normalize section name (e.g., "Added" -> "added")
        currentEntry.changes[currentSection] = []; // Initialize the section
      } else if (currentEntry && currentSection) {
        const changeMatch = line.match(/-\s*(.*)/);
        if (changeMatch) {
          currentEntry.changes[currentSection].push(changeMatch[1]); // Add the change to the current section
        }
      }
    });

    return changelog;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-sm text-gray-400 underline cursor-pointer hover:text-gray-300 transition-colors">
          {gameBuildVersion ? gameBuildVersion : "dev environment"}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Changelog</DialogTitle>
        </DialogHeader>
        {changelog ? (
          <ScrollArea className="max-h-[60vh] mt-2">
            <div>
              {changelog.unreleased && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium">
                      {changelog.unreleased.version}
                    </h4>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  {renderChanges(changelog.unreleased.changes)}
                  <Separator className="my-4" />
                </div>
              )}

              {changelog.releases.map((release, index) => (
                <div
                  key={release.version}
                  className={
                    index < changelog.releases.length - 1 ? "mb-6" : ""
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium">{release.version}</h4>
                    {release.date && (
                      <span className="text-sm text-muted-foreground">
                        {release.date}
                      </span>
                    )}
                  </div>
                  {renderChanges(release.changes)}
                  {index < changelog.releases.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p>Changelog is loading (or something went wrong)</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

function renderChanges(changes: Record<string, string[]>) {
  return Object.entries(changes).map(([category, items]) => (
    <div key={category} className="mb-3">
      <h5 className="text-sm font-medium capitalize mb-1">{category}:</h5>
      <ul className="text-sm space-y-1.5 pl-5 list-disc">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  ));
}

export default ChangelogComponent;
