import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AuthProvider } from '#/context/auth_context'
import Layout from '#/component/Layout'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles/index.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <AuthProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthProvider>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
