import { CampoValidator } from "../patterns/chainOfResponsibility/CampoValidator"

describe("CampoValidator", () => {
    let campoValidator: CampoValidator;

    beforeEach(() => {
        campoValidator = new CampoValidator();
    })

    it("deve lançar erro se os dados informados forem undefined", () => {
        expect(() => campoValidator.validate({})).toThrow("Dados da reserva incompletos");
    })

    it("deve lançar erro se os dados do usuário estiverem incompletos", () => {
        expect(() => campoValidator.validate({email: "flavia@gmail.com"})).toThrow("Dados do usuário incompletos");
    })

    it("deve lançar erro se os dados da sala estiverem incompletos", () => {
        expect(() => campoValidator.validate({numero: "123"})).toThrow("Dados incompletos da sala");
    })

    it("deve passar na validação se os dados do usuário estiverem completos", () => {
        expect(() => campoValidator.validate({nome: "Andriel", email: "andriel@gmail.com", curso: "ADS", senha: "123", tipo: "Professor"})).not.toThrow();
    })

    it("deve passar na validação se os dados da sala estiverem completos", () => {
        expect(() => campoValidator.validate({numero: "1", capacidadeMaxima: "30", tipo: "Laboratorio"})).not.toThrow();
    })

    it("deve passar na validação se os dados da reserva estiverem completos", () => {
        expect(() => campoValidator.validate({solicitante_id: "1", user_id: "1", sala_id: "1", data_da_solicitacao: "2025-07-08", data_da_reserva: "2025-07-14", horario_inicio: "20:00", horario_fim: "20:40"})).not.toThrow();
    })

})