"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlainFile } from "@/lib/types/file";

type Props = {
  video: PlainFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VideoDialog({ video, open, onOpenChange }: Props) {
  const resourceLink = `${typeof window !== "undefined" ? window.location.origin : ""}/resource/${video.id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{video?.originalName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {video && (
            <video
              src={resourceLink}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          )}
        </div>
        <DialogClose asChild>
          <Button className="mt-4">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
