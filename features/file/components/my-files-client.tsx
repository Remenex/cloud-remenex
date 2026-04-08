"use client";

import VideoCard from "./video-card";
import { PlainFile } from "@/lib/types/file";
import Button from "@/components/button";
import { Grid3X3, List, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import EmbedCodePanel from "./embed-code-panel";
import { DeleteFileDialog } from "./delete-dialog";

export default function MyFilesClient({ files }: { files: PlainFile[] }) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [embed, setEmbed] = useState<{ id: string; path: string } | null>(null);

  const handleEmbedClick = (id: string, path: string) => {
    setEmbed({ id, path });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background border-border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">
            No videos match your search.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-3"
          }
        >
          {files.map((video) => (
            <VideoCard
              key={video.id}
              file={video}
              onEmbedClick={() => handleEmbedClick(video.id, video.path)}
            />
          ))}
        </div>
      )}

      <EmbedCodePanel
        videoId={embed?.id || ""}
        open={!!embed?.id}
        path={embed?.path ?? ""}
        onClose={() => setEmbed(null)}
      />
    </>
  );
}
