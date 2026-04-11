"use client";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { useState } from "react";
import UploadModal from "../features/file/components/upload-modal";
import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  showUploadButton?: boolean;
};

export default function SidebarHeader({
  title = "Videos",
  showUploadButton = true,
}: Props) {
  const [uploadModalOpened, setUploadModalOpened] = useState<boolean>(false);
  const router = useRouter();

  const handleUploadModal = (x: boolean) => {
    setUploadModalOpened(x);
    router.refresh();
  };

  return (
    <>
      <header className="h-14 flex items-center justify-between border-b border-border px-6 shrink-0">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground" />
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        </div>

        {showUploadButton && (
          <Button
            style={{
              background: "linear-gradient(135deg, #dc2626, #ec4899)",
            }}
            size="sm"
            onClick={() => handleUploadModal(true)}
            className="gap-2 text-white border-0 p-3 py-4 font-semibold cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        )}
      </header>
      <UploadModal
        open={uploadModalOpened}
        onClose={() => handleUploadModal(false)}
        onComplete={() => handleUploadModal(false)}
      />
    </>
  );
}
