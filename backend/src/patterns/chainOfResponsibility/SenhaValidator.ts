import { AbstractValidator } from "./AbstractValidator";

export class SenhaValidator extends AbstractValidator {
    public validate(request: any): void {
        if(!request.senha || request.senha.length < 3) {
            throw new Error("Senha incorreta");
        }
    }
}