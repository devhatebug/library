import { Outlet } from "@tanstack/react-router";
import { GenrePage } from "./index.tsx";
export const GenreLayout: React.FC = () => {
  return (
    <>
      <div>
        <GenrePage />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};
