"use client";

import { Crown, Zap, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const plansMonthly = [
  {
    name: "Starter",
    value: "FREE",
    icon: Zap,
    priceID: process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_MONTHLY,
    price: 0,
    description: "Get started with video hosting.",
    features: [
      "Up to 250MB / video",
      "Up to 10 min / video",
      "Up to 15 videos",
      "1080p quality",
      "Basic analytics",
      "Embed player",
      "Remenex branding",
    ],
    popular: false,
  },
  {
    name: "Creator",
    value: "CREATOR",
    icon: Crown,
    priceID: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY, // MONTHLY
    price: 8,
    description: "Perfect for creators and growing projects.",
    features: [
      "Up to 2GB / video",
      "Up to 30 min / video",
      "Up to 100 videos",
      "4K quality",
      "Raw video hosting",
      "No branding",
      "Custom embed player",
      "Fast CDN delivery",
      "Standard support",
    ],
    popular: true,
  },
  {
    name: "Pro",
    value: "PRO",
    icon: Rocket,
    priceID: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    price: 28,
    description: "For serious creators and businesses.",
    features: [
      "Up to 5GB / video",
      "Up to 2h / video",
      "Unlimited videos",
      "4K quality",
      "Raw video hosting",
      "No branding",
      "Advanced analytics",
      "Custom domains",
      "API access",
      "Priority support",
    ],
    popular: false,
  },
];

const plansYearly = [
  {
    name: "Starter",
    value: "FREE",
    icon: Zap,
    priceID: process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_YEARLY,
    price: 0,
    description: "Get started with video hosting.",
    features: [
      "Up to 250MB / video",
      "Up to 10 min / video",
      "Up to 15 videos",
      "1080p quality",
      "Basic analytics",
      "Embed player",
      "Remenex branding",
    ],
    popular: false,
  },
  {
    name: "Creator",
    value: "CREATOR",
    icon: Crown,
    priceID: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY, // YEARLY
    price: 80,
    description: "Perfect for creators and growing projects.",
    features: [
      "Up to 2GB / video",
      "Up to 30 min / video",
      "Up to 100 videos",
      "4K quality",
      "Raw video hosting",
      "No branding",
      "Custom embed player",
      "Fast CDN delivery",
      "Standard support",
    ],
    popular: true,
  },
  {
    name: "Pro",
    value: "PRO",
    icon: Rocket,
    priceID: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
    price: 280,
    description: "For serious creators and businesses.",
    features: [
      "Up to 5GB / video",
      "Up to 2h / video",
      "Unlimited videos",
      "4K quality",
      "Raw video hosting",
      "No branding",
      "Advanced analytics",
      "Custom domains",
      "API access",
      "Priority support",
    ],
    popular: false,
  },
];

export default function Billing() {
  const [annual, setAnnual] = useState(false);
  const { data: session } = useSession();
  const [userPlan, setUserPlan] = useState<string>("FREE");

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => {
        if (data.plan) setUserPlan(data.plan);
      })
      .catch((err) => console.error("Failed to fetch user plan:", err));
  }, []);

  const plans = annual ? plansYearly : plansMonthly;

  return (
    <>
      <div className="flex items-center justify-center gap-3 mb-8">
        <span
          className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-11 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-muted"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform ${annual ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        <span
          className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
        >
          Annual{" "}
          <span className="text-primary text-xs font-semibold ml-1">
            Save 20%
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((plan, i) => {
          const isCurrent = plan.value === userPlan;

          // CTA text logic
          const planIndex = plans.findIndex((p) => p.value === plan.value);
          const currentIndex = plans.findIndex((p) => p.value === userPlan);
          let ctaText = "Current plan";
          if (!isCurrent) {
            ctaText =
              planIndex > currentIndex
                ? `Upgrade to ${plan.name}`
                : `Downgrade to ${plan.name}`;
          }

          return (
            <motion.div
              key={plan.value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-card border rounded-xl p-6 flex flex-col ${
                plan.popular
                  ? "border-primary shadow-lg ring-1 ring-primary/20"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <plan.icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-muted-foreground ml-1">
                    / {annual ? "year" : "month"}
                  </span>
                )}
                {plan.price === 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    Free forever
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={
                  isCurrent ? "outline" : plan.popular ? "gradient" : "default"
                }
                className="w-full"
                disabled={isCurrent}
                onClick={async () => {
                  if (!plan.priceID || isCurrent) return;
                  const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    body: JSON.stringify({
                      priceId: plan.priceID,
                      email: session?.user.email,
                    }),
                  });
                  const data = await res.json();
                  window.location.href = data.url;
                }}
              >
                {ctaText}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
