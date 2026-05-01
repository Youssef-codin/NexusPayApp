import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#fcf8ff] flex items-center justify-center p-8">
      <Outlet />
    </div>
  )
}