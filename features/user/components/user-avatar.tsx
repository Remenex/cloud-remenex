import { getUserColor } from "@/lib/helpers/get-user-color";
import { getUserInitials } from "@/lib/helpers/get-user-initials";
import { useSession } from "next-auth/react";

type Props = {
  sizeRem: number;
};

export default function UserAvatar({ sizeRem }: Props) {
  const { data: session } = useSession();
  const bgColor = getUserColor(session?.user);
  const { firstname, lastname } = getUserInitials(session?.user);

  const sizeStyle = {
    width: `${sizeRem}rem`,
    height: `${sizeRem}rem`,
    minWidth: `${sizeRem}rem`,
    minHeight: `${sizeRem}rem`,
  };

  return (
    <div
      style={{ ...sizeStyle, backgroundColor: bgColor }}
      className="rounded-full text-white/60 flex items-center justify-center text-xl/8 gap-1"
    >
      <span>{firstname.charAt(0).toLocaleUpperCase()}</span>
      <span>{lastname.charAt(0).toLocaleUpperCase()}</span>
    </div>
  );
}
