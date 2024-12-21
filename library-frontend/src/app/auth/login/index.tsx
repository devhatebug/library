import { FormEvent } from "react";
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
import { useAuth } from "@/providers/auth-provider.tsx";
import useMessage from "@/hooks/useMessage.ts";
import { LocalStorageKey } from "@/types/localstorage";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import { Loader2 } from "lucide-react";
import useLink from "@/hooks/useLink";

export default function LoginPage() {
  const { user, login, logout, loading } = useAuth();
  const { navigate } = useLink();
  const { openNotification, contextHolder } = useMessage();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const dataLogin = {
      email: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    if (!dataLogin.email || !dataLogin.password) {
      openNotification(
        "topRight",
        "Please enter a valid username address and password"
      );
    } else {
      await login(dataLogin.email, dataLogin.password)
        .then((result) => {
          if (result.user) {
            if (result.user.account_type === "Admin") {
              navigate({
                to: `/admin`,
              });
            } else {
              openNotification("topRight", result.message);
              navigate({
                to: `/`,
              });
            }
          }
        })
        .catch((error: AxiosError) => {
          if (error instanceof AxiosError && error.response) {
            const dataError = error.response.data as IError;
            if (dataError && dataError.message) {
              openNotification("topRight", dataError.message);
              console.log(dataError.message);
            }
          } else {
            openNotification("topRight", "An unexpected error occurred.");
          }
        });
    }
  };
  const token = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
  if (token && user) {
    return (
      <>
        {contextHolder}
        <div
          className={
            "lg:min-h-screen min-h-1/2 w-full flex flex-col justify-center items-center"
          }
        >
          <div className="mb-2 text-sm text-gray-700">
            username: {user.username}
          </div>
          <div className="mb-2 text-sm text-gray-700">Email: {user.email}</div>
          <Button
            className="mt-2.5 px-4 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={logout}
          >
            {loading && <Loader2 className="animate-spin inline-block mr-2" />}
            Logout
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full">
              {loading && <Loader2 className="animate-spin" />}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/auth/signup"
              className="text-sm text-blue-600 hover:underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
