import { createFileRoute } from '@tanstack/react-router'
import SignupForm from '#/component/Auth/SignupForm'

export const Route = createFileRoute('/signup')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignupForm />
    </div>
  )
}
