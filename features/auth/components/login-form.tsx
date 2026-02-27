"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleSendEmail = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setStep(2);
    } else {
      toast.error("Signin failed. Try again.");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6 && !newOtp.includes("")) {
      handleFinalSubmit(fullOtp);
    }
  };

  const handleFinalSubmit = async (otpCode: string) => {
    const res = await signIn("email-otp", {
      email: email,
      otp: otpCode,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.error) {
      toast.error("Wrong or expired code. Try again.");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } else if (res?.ok) {
      router.push("/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="m-auto w-80 text-center">
      {step === 1 ? (
        <>
          <form className="flex flex-col gap-4" onSubmit={handleSendEmail}>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            <Button text="Continue with Email" type="submit" />
          </form>

          <div className="w-full border-b border-border my-6"></div>

          <div className="flex flex-col gap-4">
            <Button
              startIcon={
                <Image src="icons/google.svg" alt="G" height={20} width={20} />
              }
              text="Continue with Google"
              style="bg-transparent text-white border border-border"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            />
            <Button
              startIcon={
                <Image
                  src="icons/github.svg"
                  alt="GH"
                  height={20}
                  width={20}
                  className="invert"
                />
              }
              text="Continue with GitHub"
              style="bg-transparent text-white border border-border"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          <h2 className="text-xl font-bold">Verification</h2>
          <p className="text-sm text-gray-400">
            If you have an account, we have sent a code to <b>{email}</b>.
            Eneter it below
          </p>

          <div className="flex gap-2 justify-center">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center text-xl font-bold bg-neutral-800 border border-border rounded focus:border-white outline-none transition-all"
              />
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="text-sm text-gray-400 underline"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
