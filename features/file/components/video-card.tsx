"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Play, Calendar, Code2, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteFileDialog } from "./delete-dialog";
import { PlainFile } from "@/lib/types/file";
import { FileDropdown } from "./file-dropdown";

interface VideoCardProps {
  file: PlainFile;
  onEmbedClick: (id: string) => void;
}

const VideoCard = ({ file, onEmbedClick }: VideoCardProps) => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const resourceLink = `${typeof window !== "undefined" ? window.location.origin : ""}/resource/${file.id}`;
  const thumbnail = "/api/file/thumbnail/" + file.id;

  const embedCode = `<iframe
    src=${resourceLink}
    width="640"
    height="360"
    frameborder="0"
    allow="autoplay; fullscreen"
    allowfullscreen>
  </iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-surface-sm hover:shadow-surface-md transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={thumbnail}
          alt={file.originalName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-foreground/20 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-surface-lg">
            <Play className="w-5 h-5 text-primary fill-current ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium px-2 py-0.5 rounded-md">
          {file.duration}
        </div>
        <div className="absolute top-2 right-2">
          <FileDropdown file={file} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-1">
          {file.originalName}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{file.createdAt.toDateString()}</span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 text-xs h-8"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy embed"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEmbedClick(file.id)}
            className="h-8 px-2.5"
          >
            <Code2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
