import { Link, useLocation } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { CartItemContext } from "../contexts/CartItemsContext";
import { ProductContext } from "@/contexts/ProductContext";

import {
  Utensils,
  ListOrdered,
  LogOut,
  ShoppingCart,
  Plus,
} from "lucide-react";
import Cart from "./Cart";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import AdicionarProduto from "./AdicionarProduto";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartItemContext);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [adicionarProduto, setAdicionarProduto] = useState(false);
  const location = useLocation();
  const { getProducts } = useContext(ProductContext);
  let qtdIens = 0;

  for (let index = 0; index < cartItems.length; index++) {
    qtdIens += cartItems[index].qtd;
  }
  async function getCartItems() {
    const response = await fetch("http://localhost:3000/get-cartItems", {
      method: "GET",
      credentials: "include",
    });
    if (!response) {
      return;
    }
    const data = await response.json();
    setCartItems(data);
  }

  async function handleUser() {
    try {
      const response = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Erro no acesso");
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log("erro");
    }
  }

  async function handleLogout() {
    console.log("Logout");
    const response = await fetch("http://localhost:3000/logout", {
      method: "post",
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }
    setUser(null);
  }
  useEffect(() => {
    handleUser();
    getCartItems();
  }, []);

  const trocaClasse = (path: string) => {
    const baseClass = "cursor-pointer";
    if (location.pathname === path) {
      return `${baseClass} bg-[#F2DAAC] text-[#161410]`;
    } else {
      return `${baseClass}`;
    }
  };

  return (
    <div className="bg-[#161410]">
      {showCart && <Cart setShowCart={setShowCart} showCart={showCart} />}

      <div className="mx-auto flex w-full items-center justify-between p-2 md:w-184.25 md:p-0">
        <Link to="/">
          <img src="./logo-burger.png" className="h-40 w-60" alt="" />
        </Link>

        {user ? (
          <div className="flex gap-6 text-[#F2DAAC]">
            {user.admin && (
              <TooltipProvider delay={0}>
                <div className="me-6 hidden gap-4 md:flex">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link to="/" className={trocaClasse("/")}>
                          <Utensils />
                        </Link>
                      }
                    />
                    <TooltipContent>
                      <p>Produtos</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link to="/pedidos" className={trocaClasse("/pedidos")}>
                          <ListOrdered />
                        </Link>
                      }
                    />
                    <TooltipContent>
                      <p>Pedidos</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          onClick={() => {
                            setAdicionarProduto(true);
                          }}
                        >
                          <Plus className={trocaClasse("/existe")} />
                        </button>
                      }
                    />
                    <TooltipContent>
                      <p>Adicionar produto</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}

            <div className="relative cursor-pointer">
              <TooltipProvider delay={0}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <ShoppingCart
                        onClick={() => {
                          if (cartItems.length > 0) {
                            setShowCart(!showCart);
                          }
                        }}
                        className="text-white"
                      />
                    }
                  />
                  <TooltipContent>
                    <p>Mostrar carrinho</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="absolute -top-3 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2DAAC] p-1 text-sm text-[#161410]">
                {qtdIens > 0 ? qtdIens : 0}
              </p>
            </div>
            <p>
              {user?.name
                .toLowerCase()
                .replace(/\b\w/g, (letra) => letra.toUpperCase())}
            </p>
            {/* <div className="capitalize">
              <p className="text-sm text-white lowercase">{user?.name}</p>
            </div> */}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <LogOut
                      onClick={handleLogout}
                      className="cursor-pointer text-white"
                    />
                  }
                />
                <TooltipContent>
                  <p>Sair/Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Link to="/login">
            <div className="flex h-8.75 w-32.5 cursor-pointer items-center justify-center rounded-sm bg-[#F2DAAC] text-sm">
              Entrar
            </div>
          </Link>
        )}
      </div>
      {adicionarProduto && (
        <AdicionarProduto
          fechar={() => setAdicionarProduto(false)}
          atualizarProdutos={getProducts}
        />
      )}
    </div>
  );
}

export default Header;
