import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { authRouter } from "./auth/auth.router";
import { homeRoute } from "./home/home.router";
import { genreRoute } from "./genre/genre.router";
import { bookRoute } from "./books/books.router";
import { profileRoute } from "./profile/profile.router";
import { newsRoute } from "./news/news.router";
import { recommendedRoute } from "./recommended/recommended.router";
import { contactRoute } from "./contact/contact.router";
import NotFound from "./notfound";
import { adminRoute } from "./admin/admin.router";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  // notFoundComponent: NotFound,
});

export const routeTree = rootRoute.addChildren([
  authRouter,
  homeRoute,
  genreRoute,
  bookRoute,
  profileRoute,
  newsRoute,
  recommendedRoute,
  contactRoute,
  adminRoute,
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
