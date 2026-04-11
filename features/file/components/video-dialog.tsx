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
import { useEffect, useState } from "react";

type Props = {
  videoName: string;
  videoURL: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VideoDialog({videoName, videoURL, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{videoName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {videoURL && (
            <video
              src={videoURL}
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
