import { SenhaValidator } from "../patterns/chainOfResponsibility/SenhaValidator"

describe("SenhaValidator", () => {
    let senhaValidator: SenhaValidator;

    beforeEach(() => {
        senhaValidator = new SenhaValidator();
    })

    it("deve lançar erro se o email for undefined", () => {
        expect(() => senhaValidator.validate({})).toThrow("Senha incorreta");
    })

    it("deve lançar erro se o email for inválido", () => {
        expect(() => senhaValidator.validate({senha: "12"})).toThrow("Senha incorreta");
    })

    it("deve passar na validação se a senha for válida", () => {
        expect(() => senhaValidator.validate({senha: "1234"})).not.toThrow();
    })
})