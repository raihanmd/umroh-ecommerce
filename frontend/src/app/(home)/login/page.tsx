"use client";
import AutoForm, { AutoFormSubmit } from "~/app/_components/ui/auto-form";
import { loginSchema } from "~/schema/auth.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import "react-phone-number-input/style.css";
import { z } from "zod";
import { toast } from "sonner";
import { loginAction } from "~/_actions/auth";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const res = await loginAction(data);

    if (res.success) {
      toast.success("Logged in successfully");
      router.push("/");
    } else {
      toast.error(res.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              formSchema={loginSchema}
              onSubmit={onSubmit}
              fieldConfig={{
                password: {
                  inputProps: {
                    type: "password",
                  },
                },
              }}
            >
              <AutoFormSubmit>Login</AutoFormSubmit>
            </AutoForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
