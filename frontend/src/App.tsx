import React, { useState } from "react";
import Login from "./pages/Login";
import Reservas from "./pages/Reservas";

// COMPONENTE PRINCIPAL DO APP QUE ESCOLHE ENTRE LOGIN E RESERVAS
export default function App() {
  // ESTADO PRA GUARDAR O NOME DO USUARIO LOGADO OU NULL SE NAO TIVER NINGUEM
  const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);

  // FUNCAO QUE RECEBE O NOME DO USUARIO E SALVA NO ESTADO
  function handleLogin(nome: string) {
    setUsuarioLogado(nome);
  }

  return (
    // DIV CENTRALIZADA E COM FUNDO ESCURO
    <div className="flex items-center justify-center min-h-screen bg-[#1e1e2f]">
      {/* SE TIVER USUARIO LOGADO MOSTRA AS RESERVAS, SE NAO MOSTRA O LOGIN */}
      {usuarioLogado ? (
        <Reservas nomeUsuario={usuarioLogado} />  // PASSA O NOME DO USUARIO PARA O COMPONENTE RESERVAS
      ) : (
        <Login onLogin={handleLogin} />  // PASSA A FUNCAO PARA O LOGIN CHAMAR QUANDO LOGAR
      )}
    </div>
  );
}
