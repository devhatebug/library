import { Outlet } from "@tanstack/react-router";
import { ChevronLeft, HomeIcon } from "lucide-react";
import useLink from "@/hooks/useLink";
import { Button } from "@/components/ui/button";

export const BooksLayout: React.FC = () => {
  const { navigate } = useLink();
  return (
    <>
      <div>
        <div className="flex items-center mt-8 ml-3">
          <Button
            onClick={() => {
              navigate({ to: "/" });
            }}
            variant="outline"
          >
            <HomeIcon />
            Home
          </Button>
          <Button className="ml-4" onClick={() => window.history.back()}>
            <ChevronLeft />
            Back to List
          </Button>
        </div>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};
