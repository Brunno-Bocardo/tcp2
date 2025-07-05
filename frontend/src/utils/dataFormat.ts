export function formatarDataParaBR(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // mês começa do 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}