"use client";
import { motion } from "framer-motion";

type Props = {
  label: string;
  used: number;
  limit: number;
  unit: string;
};

export default function UsageBar({ label, used, limit, unit }: Props) {
  const pct = Math.min((used / limit) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">
          {used} / {limit} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${pct > 80 ? "bg-destructive" : "gradient-primary"}`}
        />
      </div>
    </div>
  );
}
