"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { verifyOtp } from "~/_actions/auth";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/app/_components/ui/input-otp";

export default function page() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await verifyOtp(value);

    if (res.success) {
      toast.success("Verify success, now login time");
      router.push("/login");
    } else {
      toast.error(res.message || "OTP wrong");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Verify token
            </CardTitle>
            <CardDescription className="text-center">
              The token has been sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-10">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <CardFooter>
              <Button onClick={onSubmit}>Submit</Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
