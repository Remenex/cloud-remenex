"use client";
import { getUserColor } from "@/lib/helpers/get-user-color";
import { FilePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from "react";

export default function Upload() {
  const { data: session } = useSession();
  const bgColor = getUserColor(session?.user);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`relative w-2xl p-20 border border-border max-w-3xl h-96 rounded-4xl flex flex-col items-center justify-center
          transition-all duration-300
          ${hover ? "cursor-none" : "cursor-pointer"}
          ${dragOver ? "scale-105" : ""}
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
        <p>Drag the file here or click to select</p>

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
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between w-full max-w-lg">
          <span className="text-gray-700">{file.name}</span>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => setFile(null)}
          >
            Ukloni
          </button>
        </div>
      )}
    </div>
  );
}
