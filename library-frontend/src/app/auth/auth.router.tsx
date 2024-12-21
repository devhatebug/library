import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import { AuthLayout } from "./auth.layout.tsx";
import LoginPage from "./login/index.tsx";
import SignupPage from "./signup/index.tsx";

const _authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthLayout,
});

export const authRouter = _authRoute.addChildren([
  createRoute({
    getParentRoute: () => _authRoute,
    path: "/login",
    component: LoginPage,
  }),
  createRoute({
    getParentRoute: () => _authRoute,
    path: "/signup",
    component: SignupPage,
  }),
]);
