import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '#/component/Auth/LoginForm'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
