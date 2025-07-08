import { EmailValidator } from "../patterns/chainOfResponsibility/EmailValidator"

describe("EmailValidator", () => {
    let emailValidator: EmailValidator;

    beforeEach(() => {
        emailValidator = new EmailValidator();
    })

    it("deve lançar erro se o email for undefined", () => {
        expect(() => emailValidator.validate({})).toThrow("Email inválido");
    })

    it("deve lançar erro se o email for inválido", () => {
        expect(() => emailValidator.validate({email: "sem-arroba"})).toThrow("Email inválido");
    })

    it("deve passar na validação se o email foi válido", () => {
        expect(() => emailValidator.validate({email: "flavia@gmail.com"})).not.toThrow();
    })
})