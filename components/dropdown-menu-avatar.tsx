"use client";
import {
  BadgeCheckIcon,
  ChevronsUpDown,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { UserAvatar } from "./user-avatar";

type Props = {
  expanded: boolean;
};

export function DropdownMenuAvatar({ expanded }: Props) {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex justify-between items-center h-auto w-full ${expanded ? "p-2" : "p-0"} bg-transparent hover:bg-accent active:bg-accent`}
        >
          <div
            className={`flex gap-2 w-full items-center ${expanded ? "justify-start" : "justify-center"}`}
          >
            <UserAvatar
              name={session?.user.name ?? "Unknown User"}
              width={expanded ? 32 : 24}
              height={expanded ? 32 : 24}
            />
            {expanded && (
              <div className="flex-col items-start justify-start">
                <p className="font-semibold text-s text-white text-start">
                  {session?.user.name}
                </p>
                <p className="text-xs text-white">{session?.user.email}</p>
              </div>
            )}
          </div>
          {expanded && <ChevronsUpDown className="w-4 text-white" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
