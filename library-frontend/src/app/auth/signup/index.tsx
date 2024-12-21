import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { signupApi } from "@/api/auth-api.ts";
import { FormEvent, useState } from "react";
import { Credentials } from "@/api/auth-api.ts";
import { AxiosError } from "axios";
import { IError } from "@/types/error.ts";
import useMessage from "@/hooks/useMessage";
import useLink from "@/hooks/useLink.ts";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const { navigate } = useLink();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useMessage();
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const dataSignup: Credentials = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    setLoading(true);
    if (!dataSignup.username || !dataSignup.email || !dataSignup.password) {
      openNotification("topRight", "Please enter full valid");
      setLoading(false);
    } else {
      await signupApi(dataSignup)
        .then((response) => {
          setLoading(false);
          openNotification("topRight", response.message);
          navigate({
            to: "/auth/login",
          });
        })
        .catch((error: AxiosError) => {
          if (error instanceof AxiosError && error.response) {
            const dataError = error.response.data as IError;
            if (dataError && dataError.message) {
              openNotification("topRight", dataError.message);
            }
          } else {
            openNotification("topRight", "An unexpected error occurred.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      {contextHolder}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                name="password"
              />
            </div>
            <Button type="submit" className="w-full">
              {loading && <Loader2 className="animate-spin" />}
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
