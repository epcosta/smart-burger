import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");

  const formValido =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confPassword.trim() !== "" &&
    cep.trim() !== "";

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!formValido) {
        setError("Todos os campos são OBRIGATÓRIOS");
        return;
      }

      if (password !== confPassword) {
        setError("As senhas não conferem");
        return;
      }

      const response = await fetch("http://localhost:3000/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, cep }),
      });

      console.log(response.status);
      if (response.status === 404) {
        setError("Usuario não encontrado");
      }
      if (response.status === 400) {
        setError("Usuario e senha são obrigatórios");
      }
      if (response.status === 409) {
        setError("Email já cadastrado");
      }
      if (response.status === 201) {
        setError("");
        setName("");
        setEmail("");
        setPassword("");
        setconfPassword("");
        setCep("");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
      return;
    }

    console.log({ name, email, password, confPassword, cep });
  }

  return (
    <form
      className="flex h-screen items-center justify-center bg-[#161410]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Link to="/">
          <img className="mb-2" src="./logo.png" alt="" />
        </Link>
        <Input
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Nome completo"
          type="text"
        />

        <Input
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          value={email}
          placeholder="E-mail"
          type="email"
          autoComplete="username"
        />

        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          value={password}
          type="password"
          autoComplete="new-password"
        />

        <Input
          onChange={(e) => setconfPassword(e.target.value)}
          value={confPassword}
          placeholder="Confirme a senha"
          type="password"
          autoComplete="new-password"
        />

        <Input
          onChange={(e) => setCep(e.target.value)}
          value={cep}
          placeholder="CEP"
          type="text"
        />

        <p className="text-red-500">{error}</p>

        <div className="mt-3 flex w-full flex-col gap-2">
          <Button
            type="submit"
            disabled={!formValido}
            variant={!formValido ? "opacity" : "default"}
            title="Criar Conta"
          />
          <Link to="/login" className="w-full">
            <Button variant="outline" title="já tenho uma conta" />
          </Link>
        </div>
      </div>
    </form>
  );
}
export default Register;
