"use client";

import { formatBytes } from "@/lib/helpers/format-bytes";
import { getUserColor } from "@/lib/helpers/get-user-color";
import { FilePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function Upload() {
  const { data: session } = useSession();
  const bgColor = getUserColor(session?.user);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    } else {
      toast.error("Only video files are allowed.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    } else {
      toast.error("Only video files are allowed.");
    }
  };

  const handleUpload = (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/file/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        setUploadedBytes(event.loaded);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        toast.success("Upload successful!");
        setUploadProgress(100);
      } else {
        toast.error("Upload failed");
        setUploadProgress(0);
        setUploadedBytes(0);
      }
      setUploading(false);
      setFile(null);
    };

    xhr.onerror = () => {
      toast.error("Upload error");
      setUploadProgress(0);
      setUploadedBytes(0);
      setUploading(false);
      setFile(null);
    };

    xhr.send(formData);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {!file && !uploading && (
        <div
          className={`relative w-full sm:w-2xl p-20 border border-border max-w-3xl h-96 rounded-4xl flex flex-col items-center justify-center
          transition-all duration-300
          ${hover ? "cursor-none" : "cursor-pointer"}
          ${dragOver ? "bg-border" : ""}
        `}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={handleMouseMove}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            inputRef.current?.click();
            setHover(false);
          }}
        >
          <p className="text-center">Drag the file here or click to select</p>

          {hover && (
            <div
              className="whitespace-nowrap flex items-center gap-2 bg-border pointer-events-none absolute px-4 py-2 text-white text-sm rounded-full shadow-xl transition-transform duration-75"
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
                transform: "translate(-50%, -150%)",
                backgroundColor: bgColor,
              }}
            >
              <FilePlus />
              <p className="text-lg">Add file</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {file && uploading && (
        <div className="w-full sm:w-2xl text-sm flex flex-col gap-1">
          <div>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span>
            {formatBytes(uploadedBytes)} of {formatBytes(file.size)}
          </span>
        </div>
      )}
    </div>
  );
}
