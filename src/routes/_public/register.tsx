import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "#/features/auth/RegisterForm"

export const Route = createFileRoute("/_public/register")({
  component: Register,
})

function Register() {
  return <RegisterForm />
}