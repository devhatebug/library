import { Outlet } from "@tanstack/react-router";
export const ExampleLayout: React.FC = () => {
  return (
    <>
      <div>
        <div>Hello Layout</div>
        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};
