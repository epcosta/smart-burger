import Input from "./components/Input";

function App() {
  return (
    <div className="bg-[#161410]">
      <p className="flex gap-2 p-2">
        <Input type="text" placeholder="E-mail" />
        <Input type="password" placeholder="Senha" />
      </p>
    </div>
  );
}

export default App;
