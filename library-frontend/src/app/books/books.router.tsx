import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import BookListPage from "./index.tsx";
import { BooksLayout } from "./books.layout";
import BookDetail from "./book-index/index.tsx";

const _bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books",
  component: BooksLayout,
});

export const bookRoute = _bookRoute.addChildren([
  createRoute({
    getParentRoute: () => _bookRoute,
    path: "/all",
    component: BookListPage,
  }),
  createRoute({
    getParentRoute: () => _bookRoute,
    path: "/$id",
    component: BookDetail,
  }),
]);
