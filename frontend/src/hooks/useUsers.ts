import { useEffect, useState } from "react";
import { User } from "../types";
import { getUsers, addUser } from "../service/api";

// HOOK PRA GERENCIAR OS USUARIOS DO SISTEMA E IDENTIFICAR O USUARIO LOGADO
export function useUsers(emailUsuario?: string) {
    const [users, setUsers] = useState<User[]>([]);    // ESTADO COM TODOS OS USUARIOS

    const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null); // ESTADO COM O USUARIO QUE ESTA LOGADO (BASEADO NO EMAIL)

    const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);  // SALVA O TIPO DO USUARIO (EX: PROF, COORD)


    const [loading, setLoading] = useState<boolean>(true);  // ESTADO PRA SABER SE TA CARREGANDO OS DADOS

    const [error, setError] = useState<string | null>(null);// PRA GUARDAR MENSAGEM DE ERRO CASO DER ALGUM PROBLEMA

    // ESSE USEEFFECT RODA SEMPRE QUE O EMAIL DO USUARIO MUDAR
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true); // INICIA O LOADING
            setError(null); // LIMPA QUALQUER ERRO ANTERIOR

            try {
                const data = await getUsers(); // BUSCA TODOS OS USUARIOS NA API
                setUsers(data); // SALVA OS USUARIOS NO ESTADO

                // SE TIVER UM EMAIL PASSADO, PROCURA O USUARIO CORRESPONDENTE
                if (emailUsuario) {
                    const user = data.find(u => u.email === emailUsuario);
                    setUsuarioLogado(user || null); // DEFINE O USUARIO LOGADO
                    setTipoUsuario(user?.tipo || null); // SALVA O TIPO DO USUARIO
                }
            } catch (err) {
                setError("Erro ao carregar usuarios"); // SE DER ERRO, MOSTRA ESSA MENSAGEM
            } finally {
                setLoading(false); // TERMINA DE CARREGAR
            }
        }

        fetchUsers(); // CHAMA A FUNCAO QUANDO O COMPONENTE MONTAR OU O EMAIL MUDAR
    }, [emailUsuario]);

    // FUNCAO PRA CRIAR UM NOVO USUARIO
    async function criarUser(user: Omit<User, "id">) {
        try {
            await addUser(user); // ENVIA O NOVO USUARIO PRA API

            // DEPOIS DE CRIAR, PEGA A LISTA ATUALIZADA
            const data = await getUsers();
            setUsers(data); // ATUALIZA A LISTA COM O NOVO USUARIO
            return true; // RETORNA TRUE SE DEU TUDO CERTO
        } catch (err) {
            setError("Erro ao criar usuario"); // MOSTRA ERRO SE DER PROBLEMA
            return false; // RETORNA FALSE SE NAO CONSEGUIU CRIAR
        }
    }

    return { users, usuarioLogado, tipoUsuario, loading, error, criarUser };
}
