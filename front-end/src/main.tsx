import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./Router.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import "./index.css";
import { CartItemsProvider } from "./contexts/CartItemsContext.tsx";
import { ProductProvider } from "./contexts/ProductContext.tsx";

//import Login from "./Login.tsx";
//import Register from "./Register.tsx";
//import Register from "./Register.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductProvider>
      <CartItemsProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </CartItemsProvider>
    </ProductProvider>
  </StrictMode>,
);
