import React, { useState } from "react";

// INTERFACE QUE RECEBE UMA FUNCAO PARA CHAMAR QUANDO O LOGIN DER CERTO
interface LoginProps {
    onLogin: (nomeUsuario: string) => void;
}

// COMPONENTE LOGIN QUE RECEBE A FUNCAO onLogin COMO PROPRIEDADE
const Login: React.FC<LoginProps> = ({ onLogin }) => {
    console.log("Login componente renderizado"); // <-- Log para saber se o componente ta rodando

    // ESTADO PARA GUARDAR O EMAIL DO USUARIO
    const [email, setEmail] = useState("");
    // ESTADO PARA GUARDAR A SENHA
    const [senha, setSenha] = useState("");

    // FUNCAO QUE RODA QUANDO O FORMULARIO FOR ENVIADO
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // PREVINIR O RELOAD DA PAGINA QUANDO CLICAR EM ENVIAR
        console.log("Tentando fazer login com:", { email, senha }); // <-- Log do submit

        try {
            // CHAMADA PARA O BACKEND FAZER LOGIN
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            // PEGANDO A RESPOSTA E CONVERTENDO PARA OBJETO JS
            const data = await response.json();
            console.log("Resposta recebida do backend:", data); // <-- Log da resposta

            // SE LOGIN DEU CERTO (success == true)
            if (data.success && (data.user || data.email)) {
                const usuario = data.user || data;
                console.log("Login bem-sucedido! Usuário autenticado:", usuario);

                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

                onLogin(usuario);
            } else {
                alert("Usuário ou senha inválidos!");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao conectar com o servidor");
        }
    };

    // JSX QUE RENDERIZA O FORMULARIO DE LOGIN
    return (
        <div className="flex flex-col items-center justify-center bg-[#1e1e2f] text-[#e0e0e0] font-roboto px-6 p-6 rounded-lg shadow-md max-w-sm w-full">
            <form
                onSubmit={handleSubmit} // CHAMA FUNCAO QUANDO APERTA ENTRAR
                className="w-full max-w-sm bg-[#2a2a3d] p-6 rounded-lg shadow-md"
            >
                <h1 className="text-3xl text-[#80cbc4] mb-6 text-center">Login</h1>

                {/* CAMPO PARA DIGITAR O EMAIL DO USUARIO */}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">
                        E-mail
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            console.log("Campo email alterado:", e.target.value);
                        }}
                        className="w-full p-2 bg-[#44475a] text-[#e0e0e0] rounded outline-none"
                    />
                </div>

                {/* CAMPO PARA DIGITAR A SENHA */}
                <div className="mb-4">
                    <label htmlFor="senha" className="block mb-2">
                        Senha
                    </label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => {
                            setSenha(e.target.value);
                            console.log("Campo senha alterado:", e.target.value);
                        }}
                        className="w-full p-2 bg-[#44475a] text-[#e0e0e0] rounded outline-none"
                    />
                </div>

                {/* BOTAO PARA ENVIAR O FORMULARIO */}
                <button
                    type="submit"
                    onClick={() => console.log("Botão de login clicado")} // <-- Log do clique no botao
                    className="w-full py-2 bg-[#80cbc4] text-[#1e1e2f] font-bold rounded hover:bg-[#00acc1] transition-colors"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;