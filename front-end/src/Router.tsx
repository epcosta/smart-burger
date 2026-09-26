import Header from "./components/Header.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Pedidos from "./pages/Pedidos.tsx";
import Register from "./pages/Register.tsx";
import { createBrowserRouter, Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#161410]">
      <Header />
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/pedidos",
        element: <Pedidos />,
      },
    ],
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/cadastro",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
]);
