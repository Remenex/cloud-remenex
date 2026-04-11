import { useMemo } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

type Props = {
  image?: string;
  name?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
};

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#6A5ACD",
  "#FF8C42",
  "#2ECC71",
  "#E91E63",
  "#00BCD4",
  "#9C27B0",
  "#FF9800",
  "#3F51B5",
  "#F44336",
  "#009688",
  "#FFC107",
  "#673AB7",
];

const textColor = "#0000009A";

export const UserAvatar = ({
  image,
  name,
  width,
  height,
  fontSize,
  className,
}: Props) => {
  const w = width ?? 80;
  const h = height ?? 80;
  const fS = fontSize ?? 16;

  const userInitials = useMemo(() => {
    if (!name) return "";

    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  }, [name]);

  const bgColor = useMemo(() => {
    if (!name) return colors[0];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }, [name]);

  return (
    <Avatar style={{ width: w, height: h }} className={className}>
      {image && (
        <AvatarImage
          src={image}
          className="object-cover"
          alt={name || "User avatar"}
        />
      )}

      <AvatarFallback
        className="font-bold flex items-center justify-center"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontSize: fS,
        }}
        delayMs={600}
      >
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
};
