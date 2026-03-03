"use client";

import UserAvatar from "@/features/user/components/user-avatar";
import { Files, House, Puzzle, Settings } from "lucide-react";
import Link from "next/link";
import NavIcon from "./nav-icon";

export default function Navigation() {
  return (
    <aside className="m-auto w-fit p-3 flex items-center fixed bottom-0 left-1/2 transform -translate-x-1/2">
      <nav className="flex gap-6 items-center rounded-full bg-border px-5 py-3">
        <Link href="#">
          <UserAvatar sizeRem={3} />
        </Link>
        <NavIcon icon={<House size={30} />} link="/" />
        <NavIcon icon={<Files size={30} />} link="/files" />
        <NavIcon icon={<Puzzle size={30} />} link="#" />
        <NavIcon icon={<Settings size={30} />} link="#" />
      </nav>
    </aside>
  );
}
