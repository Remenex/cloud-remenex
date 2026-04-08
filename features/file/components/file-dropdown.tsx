"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlainFile } from "@/lib/types/file";
import { Copy, Edit, EllipsisVertical, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DeleteFileDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";

export function FileDropdown({ file }: { file: PlainFile }) {
  const resourceLink = `${typeof window !== "undefined" ? window.location.origin : ""}/resource/${file.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resourceLink);
      toast("Link copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy />
            Copy Link
          </DropdownMenuItem>
          <Link href={`/resource/${file.id}`} target="_blank">
            <DropdownMenuItem>
              <ExternalLink />
              Open
            </DropdownMenuItem>
          </Link>
          <RenameDialog file={file} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DeleteFileDialog file={file} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
