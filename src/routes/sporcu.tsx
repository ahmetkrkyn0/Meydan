import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/sporcu")({
  component: SporcuLayout,
});

function SporcuLayout() {
  return <Outlet />;
}
