import { Outlet } from "@tanstack/react-router";
export const AuthLayout: React.FC = () => {
  return (
    <>
      <div className="relative h-screen">
        {/* Page Content */}
        <main className="absolute h-auto min-w-80 w-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Outlet />
        </main>
      </div>
    </>
  );
};
