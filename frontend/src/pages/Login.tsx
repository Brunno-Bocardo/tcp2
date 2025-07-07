import React, { useState } from "react";

interface LoginProps {
    onLogin: (nomeUsuario: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loginErro, setLoginErro] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !senha) {
            setLoginErro("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if ((data && data.id && data.email) || (data.user && data.user.id)) {
                const usuario = data.user || data;
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                setLoginErro("");
                onLogin(usuario);
            } else {
                setLoginErro("Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setLoginErro("Erro ao conectar com o servidor.");
        }
    };

    const handleCadastrarClick = (e: React.MouseEvent) => {
        e.preventDefault();
        alert("Função de cadastro ainda não foi implementada.");
    };

    const handleEsqueceuSenhaClick = (e: React.MouseEvent) => {
        e.preventDefault();
        alert("Função de recuperação de senha ainda não foi implementada.");
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e1e2f]">
            <div className="bg-[#2a2a3d] text-[#e0e0e0] font-roboto p-10 rounded-lg shadow-2xl max-w-xl w-full">
                <form onSubmit={handleSubmit} className="space-y-7">
                    <h1 className="text-3xl text-[#80cbc4] font-bold text-center">Login</h1>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            className="w-full p-3 bg-[#44475a] text-[#e0e0e0] rounded outline-none focus:ring-2 focus:ring-[#80cbc4]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="senha" className="block mb-2 text-sm font-medium">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="********"
                            className="w-full p-3 bg-[#44475a] text-[#e0e0e0] rounded outline-none focus:ring-2 focus:ring-[#80cbc4]"
                            required
                        />
                        {loginErro && (
                            <p className="text-red-500 text-sm mt-2">{loginErro}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#80cbc4] text-[#1e1e2f] font-bold rounded hover:bg-[#00acc1] transition-colors">
                        Entrar
                    </button>

                    <div className="text-sm text-center text-[#a0a0a0] pt-2 space-y-2">
                        <p>
                            <a
                                href="#"
                                onClick={handleEsqueceuSenhaClick}
                                className="hover:underline"
                            >
                                Esqueceu a senha?
                            </a>
                        </p>
                        <p>
                            Não tem uma conta?{" "}
                            <a
                                href="#"
                                onClick={handleCadastrarClick}
                                className="text-[#80cbc4] hover:underline"
                            >
                                Cadastre-se
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;