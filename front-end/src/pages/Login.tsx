import { useState, useContext } from "react";
import Input from "../components/Input";
import { Link } from "react-router";
import Button from "../components/Button";
import { useNavigate } from "react-router";

import { UserContext } from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //const [user, setUser] = useState<UserInterface | null>(null);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("ANTES DO FETCH");

    try {
      if (!email || !password) {
        setError("Usuario e senha são obrigatórios");
        return;
      }

      const response = await fetch("http://localhost:3000/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("DEPOIS DO FETCH");
      if (response.status === 404) {
        setError("Usuario não encontrado");
        return;
      }
      if (response.status === 400) {
        setError("Usuario e senha são obrigatórios");
        return;
      }
      if (response.status === 401) {
        setError("Usuario NÃO encontrado");
        return;
      }
      if (response.status === 200) {
        setError("");
        setEmail("");
        setPassword("");
        const data = await response.json();
        setUser(data);
        navigate("/");
      }
    } catch (error) {
      console.error("ERRO NO FETCH:", error);
      return;
    }
  }

  return (
    <form
      className="flex h-screen items-center justify-center bg-[#161410]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center gap-2">
        <Link to="/" className="flex justify-center">
          <img className="mb-2" src="./logo.png" alt="" />
        </Link>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="E-mail"
          type="email"
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Senha"
          type="password"
        />
        <p className="text-sm font-bold text-red-500">{error}</p>

        <Button type="submit" variant="default" title="Login" />

        <Link to="/cadastro" className="w-full">
          <Button type="button" variant="outline" title="Não tenho uma conta" />
        </Link>
      </div>
    </form>
  );
}
export default Login;
