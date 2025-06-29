import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Reservas from "./pages/Reservas";

// COMPONENTE PRINCIPAL DO APP QUE ESCOLHE ENTRE LOGIN E RESERVAS
export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  // AO MONTAR O COMPONENTE, TENTA CARREGAR O EMAIL DO LOCALSTORAGE
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  // FUNCAO QUE RECEBE O EMAIL DO USUARIO E SALVA NO ESTADO E LOCALSTORAGE
  function handleLogin(usuario: any) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    setUsuarioLogado(usuario);
  }

  // FUNCAO PARA DESLOGAR
  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1e1e2f]">
      {usuarioLogado ? (
        <>
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Sair
          </button>

          <Reservas nomeUsuario={usuarioLogado.email} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
