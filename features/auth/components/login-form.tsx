"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const Login = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setStep(2);
    } else {
      toast.error("Failed to send code");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6 && !newOtp.includes("")) {
      handleVerify(fullOtp);
    }
  };

  const handleVerify = async (code: string) => {
    const res = await signIn("email-otp", {
      email,
      otp: code,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.error) {
      toast.error("Wrong or expired code");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } else {
      window.location.href = "/";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT */}
      <div className="w-full lg:w-105 xl:w-120 flex flex-col justify-between p-8 lg:p-12 bg-background">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <div className="py-8 relative w-64 h-10">
              <Image
                src={"/images/RemenexCloud Black.svg"}
                fill
                alt="Remenex Cloud"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
              {step === 1
                ? "Log in to your account"
                : "Enter verification code"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {step === 1
                ? "Enter your email to continue"
                : `We sent a code to ${email}`}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {/* GOOGLE */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm font-medium text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* GITHUB */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm font-medium text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.333-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.096.81 2.215 0 1.6-.015 2.89-.015 3.285 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-11 font-semibold"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-center"
                >
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      value={value}
                      maxLength={1}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-10 h-12 text-center text-lg border border-border rounded-lg bg-background"
                    />
                  ))}
                </motion.div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-muted-foreground underline w-full text-center"
                >
                  Back
                </button>
              </>
            )}
          </form>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} Remenex Cloud. All rights reserved.
        </p>
      </div>

      <div className="hidden lg:flex flex-1 overflow-hidden relative">
        <Image
          src={"/images/login-hero.png"}
          alt="Video hosting illustration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/80 to-red-600/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-br from-background to-transparent opacity-100" />

        <div className="relative z-10 flex flex-col justify-top p-16 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Video hosting made simple
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Upload, manage and embed videos with blazing fast performance.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
