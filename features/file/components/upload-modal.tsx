"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileVideo, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (file: { name: string; [key: string]: any }) => void;
}

const UploadModal = ({ open, onClose, onComplete }: UploadModalProps) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadedBytes, setUploadedBytes] = useState(0);

  const resetState = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    setDone(false);
    setUploadedBytes(0);
  };

  const uploadFile = useCallback(
    (file: File) => {
      setFile(file);
      setUploading(true);
      setProgress(0);
      setUploadedBytes(0);

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/file/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setProgress(percent);
          setUploadedBytes(event.loaded);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setUploading(false);
          setDone(true);

          const response = JSON.parse(xhr.responseText);
          onComplete({ name: file.name, ...response.file });

          setTimeout(() => {
            resetState();
            onClose();
            toast.success("Upload complete!");
          }, 1200);
        } else {
          console.error("Upload failed", xhr.responseText);
          toast.error("Upload failed!");
          resetState();
          onClose();
        }
      };

      xhr.onerror = () => {
        console.error("Upload error");
        toast.error("Upload error!");
        resetState();
        onClose();
      };

      xhr.send(formData);
    },
    [onClose, onComplete],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("video/")) {
        uploadFile(f);
      } else {
        toast.error("Only video files are allowed.");
      }
    },
    [uploadFile],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("video/")) {
      uploadFile(f);
    } else {
      toast.error("Only video files are allowed.");
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !uploading) {
            resetState();
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-card border border-border rounded-xl shadow-surface-lg w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              Upload video
            </h2>
            {!uploading && (
              <button
                onClick={() => {
                  resetState();
                  onClose();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer
                  ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"}`}
              >
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Drag & drop your video here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse · MP4, MOV, WebM
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <FileVideo className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {done
                        ? "Upload complete"
                        : `Uploading... ${Math.round(progress)}% (${(uploadedBytes / 1024 / 1024).toFixed(2)} MB of ${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
