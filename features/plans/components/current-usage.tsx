"use client";
import { useEffect, useState } from "react";
import UsageBar from "./usage-bar";
import { PLANS } from "@/lib/config/plans";

export default function CurrentUsage() {
  const [usageData, setUsageData] = useState({
    videosUsed: 0,
    storageUsed: 0,
    bandwidthUsed: 0,
  });
  const [userPlan, setUserPlan] = useState<"FREE" | "CREATOR" | "PRO">("FREE");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/user/plan");
        if (!res.ok) throw new Error("Failed to fetch plan");
        const data = await res.json();
        if (data.plan) setUserPlan(data.plan);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlan();
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/user/usage");
        if (!res.ok) throw new Error("Failed to fetch usage");
        const data = await res.json();

        setUsageData({
          videosUsed: parseFloat((data.usage.videosUsed || 0).toFixed(2)),
          storageUsed: parseFloat((data.usage.storageUsed || 0).toFixed(3)),
          bandwidthUsed: parseFloat((data.usage.bandwidthUsed || 0).toFixed(2)),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsage();
  }, []);

  const planLimits = PLANS[userPlan];

  const storageLimitGB =
    planLimits.maxStorage === Infinity
      ? Infinity
      : (planLimits.maxStorage / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="mb-10 flex justify-center">
      <div className="max-w-5xl w-full">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
          Current usage
        </h2>
        <div className="bg-card border border-border rounded-xl p-5 space-y-5 max-w-5xl">
          <UsageBar
            label="Videos"
            used={usageData.videosUsed}
            limit={planLimits.maxVideos}
            unit=""
          />
          <UsageBar
            label="Storage"
            used={usageData.storageUsed}
            limit={storageLimitGB}
            unit="GB"
          />
          <UsageBar
            label="Bandwidth"
            used={usageData.bandwidthUsed}
            limit={50}
            unit="GB"
          />
        </div>
      </div>
    </div>
  );
}
