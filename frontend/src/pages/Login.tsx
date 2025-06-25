import React, { useState } from "react";

// INTERFACE QUE RECEBE UMA FUNCAO PARA CHAMAR QUANDO O LOGIN DER CERTO
interface LoginProps {
    onLogin: (nomeUsuario: string) => void;
}

// COMPONENTE LOGIN QUE RECEBE A FUNCAO onLogin COMO PROPRIEDADE
const Login: React.FC<LoginProps> = ({ onLogin }) => {
    // ESTADO PARA GUARDAR O NOME DO USUARIO
    const [nome, setNome] = useState("");
    // ESTADO PARA GUARDAR A SENHA
    const [senha, setSenha] = useState("");

    // FUNCAO QUE RODA QUANDO O FORMULARIO FOR ENVIADO
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // PREVINIR O RELOAD DA PAGINA QUANDO CLICAR EM ENVIAR
        console.log("Tentando fazer login com:", { nome, senha });

        try {
            // CHAMADA PARA O BACKEND FAZER LOGIN
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST", // METODO POST PRA MANDAR OS DADOS
                headers: { "Content-Type": "application/json" }, // DIZENDO QUE VAMOS ENVIAR JSON
                body: JSON.stringify({ email: nome, senha }), // TRANSFORMANDO OBJETO EM JSON PARA ENVIAR
            });

            // PEGANDO A RESPOSTA E CONVERTENDO PARA OBJETO JS
            const data = await response.json();

            // SE LOGIN DEU CERTO (success == true)
            if (data.success) {
                console.log("Login bem-sucedido!");
                onLogin(nome);  // AVISAR O APP QUE O USUARIO LOGOU, PASSANDO O NOME
            } else {
                alert("Usuário ou senha inválidos!"); // ALERTA SE LOGIN NAO DEU CERTO
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro ao conectar com o servidor"); // ALERTA SE NAO CONSEGUIU CONECTAR
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

                {/* CAMPO PARA DIGITAR O NOME DO USUARIO */}
                <div className="mb-4">
                    <label htmlFor="nome" className="block mb-2">
                        Usuário
                    </label>
                    <input
                        type="text"
                        id="nome"
                        value={nome} // VALOR DO INPUT QUE VEM DO ESTADO
                        onChange={(e) => setNome(e.target.value)} // ATUALIZA ESTADO QUANDO DIGITA
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
                        value={senha} // VALOR DO INPUT QUE VEM DO ESTADO
                        onChange={(e) => setSenha(e.target.value)} // ATUALIZA ESTADO QUANDO DIGITA
                        className="w-full p-2 bg-[#44475a] text-[#e0e0e0] rounded outline-none"
                    />
                </div>

                {/* BOTAO PARA ENVIAR O FORMULARIO */}
                <button
                    type="submit"
                    className="w-full py-2 bg-[#80cbc4] text-[#1e1e2f] font-bold rounded hover:bg-[#00acc1] transition-colors"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;