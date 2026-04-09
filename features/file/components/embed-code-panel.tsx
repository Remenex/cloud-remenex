import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmbedCodePanelProps {
  videoId: string;
  open: boolean;
  path: string;
  onClose: () => void;
}

const EmbedCodePanel = ({
  videoId,
  open,
  onClose,
  path,
}: EmbedCodePanelProps) => {
  const [copied, setCopied] = useState(false);
  const resourceLink = `${typeof window !== "undefined" ? window.location.origin : ""}/resource/${videoId}`;

  const embedCode = `<iframe
  src=${resourceLink}
  width="640"
  height="360"
  frameborder="0"
  allow="autoplay; fullscreen"
  allowfullscreen
></iframe>`;
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-card border border-border rounded-xl shadow-surface-lg w-full max-w-lg overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              Embed code
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy and paste this code into your Webflow or any HTML page.
            </p>

            <div className="relative">
              <pre className="bg-muted rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed border border-border">
                {embedCode}
              </pre>
            </div>

            <Button
              onClick={handleCopy}
              className="w-full gap-2 text-white cursor-pointer font-semibold"
              style={{
                background: "linear-gradient(135deg, #dc2626, #ec4899)",
              }}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied to clipboard" : "Copy embed code"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmbedCodePanel;
