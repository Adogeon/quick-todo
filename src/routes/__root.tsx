import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => {
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" activeProps={{ className: "font-bold" }}>
        Home
      </Link>{" "}
      <Link to="/about" activeProps={{ className: "font-bold" }}>
        About
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools position="bottom-right" />
  </>;
};

export const Route = createRootRoute({ component: RootLayout });
