"use client";
import AutoForm, { AutoFormSubmit } from "~/app/_components/ui/auto-form";
import { registerSchema } from "~/schema/auth.schema";
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
import { registerMember } from "~/_actions/auth";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const res = await registerMember(data);

    if (res.success) {
      toast.success("Please check your email for verification");
      router.push("/verify");
    } else {
      toast.error(res.message || "Register failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Register
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AutoForm
              formSchema={registerSchema}
              onSubmit={onSubmit}
              fieldConfig={{
                name: {
                  inputProps: {
                    placeholder: "Name",
                  },
                },
                email: {
                  inputProps: {
                    placeholder: "Email",
                    type: "email",
                  },
                },
                phone: {
                  inputProps: {
                    placeholder: "Phone",
                  },
                },
                confirm_password: {
                  inputProps: {
                    type: "password",
                    placeholder: "Confirm Password",
                  },
                  description: "Must match your password",
                },
                password: {
                  inputProps: {
                    type: "password",
                    placeholder: "Password",
                  },
                },
              }}
            >
              <AutoFormSubmit>Register</AutoFormSubmit>
            </AutoForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
