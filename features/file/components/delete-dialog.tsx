import Button from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PlainFile } from "@/lib/types/file";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteFileDialog({ file }: { file: PlainFile }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
      <form>
        <DialogTrigger asChild>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete this file?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-1 justify-end">
            <Button
              text="Close"
              variant={"secondary"}
              size={"small"}
              onClick={() => setOpen(false)}
              className="w-fit"
            />
            <Button
              text="Delete"
              variant="primary"
              size="small"
              onClick={async () => {
                try {
                  const res = await fetch(`/api/file/${file.id}/delete`, {
                    method: "DELETE",
                  });
                  const data = await res.json();

                  if (!data.success)
                    throw new Error(data.error || "Failed to delete");

                  setOpen(false);
                  router.refresh();
                  toast.success("File deleted!");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete file");
                }
              }}
              className="w-fit"
            />
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
