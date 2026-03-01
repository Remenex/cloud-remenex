"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  link?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function NavIcon({ icon, link, ...props }: Props) {
  const currentPath = usePathname();
  const isActive = currentPath === link;

  const className = `w-fit rounded-xl cursor-pointer transition duration-200  
    ${isActive ? "text-white" : "hover:text-white"} ${props.className ?? ""}`;

  const content = (
    <div {...props} className={className}>
      {icon}
    </div>
  );

  return link ? (
    <Link className="block w-fit" href={link}>
      {content}
    </Link>
  ) : (
    content
  );
}
