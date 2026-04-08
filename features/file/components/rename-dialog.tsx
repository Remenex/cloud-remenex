"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PlainFile } from "@/lib/types/file";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  file: PlainFile;
  onRename?: (newName: string) => void;
};

export function RenameDialog({ file, onRename }: Props) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState(file.originalName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("Djole");
    if (!newName.trim()) return toast.error("Name cannot be empty");

    setLoading(true);
    try {
      const res = await fetch("/api/file/rename", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id, newName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rename failed");

      toast.success("File renamed!");
      onRename?.(data.file.originalName);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to rename file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dugme za otvaranje */}
      <Button
        className="bg-transparent flex items-center justify-start gap-2 text-white px-1 hover:bg-accent w-full"
        onClick={() => setOpen(true)}
      >
        <Edit />
        Rename
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <form onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Rename File</DialogTitle>
              <DialogDescription>
                Change your file's name here. Click save when done.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Input
                  id="video-name"
                  name="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={loading}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button disabled={loading} onClick={handleSubmit}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
