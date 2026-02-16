"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    await signIn("email", {
      email,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="m-auto w-80">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button text="Continue with Email" type={"submit"} />
      </form>

      <div className="w-full border-b border-border my-6"></div>

      <div className="flex flex-col gap-4">
        <Button
          startIcon={
            <Image
              src="icons/google.svg"
              alt="google-logo"
              height={20}
              width={20}
            />
          }
          text="Continue with Google"
          style="bg-transparent text-white"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        />
        <Button
          startIcon={
            <Image
              src="icons/github.svg"
              alt="github-logo"
              height={20}
              width={20}
              className="invert"
            />
          }
          text="Continue with GitHub"
          style="bg-transparent text-white"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        />
      </div>
    </div>
  );
}
