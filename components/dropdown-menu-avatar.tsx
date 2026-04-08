import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDown,
  CreditCardIcon,
  LogOutIcon,
  Menu,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  expanded: boolean;
};

export function DropdownMenuAvatar({ expanded }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex justify-between items-center h-auto w-full ${expanded ? "p-2" : "p-0"} bg-transparent hover:bg-accent active:bg-accent`}
        >
          <div
            className={`flex gap-2 w-full items-center ${expanded ? "justify-start" : "justify-center"}`}
          >
            <Avatar className={`${expanded ? "w-8 h-8" : "w-6 h-6"}`}>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            {expanded && (
              <div className="flex-col items-start justify-start">
                <p className="font-semibold text-s text-white text-start">
                  Djordje Ivanovic
                </p>
                <p className="text-xs text-white">idjordje63@gmail.com</p>
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
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
