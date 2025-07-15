import { AbstractValidator } from "./AbstractValidator";

export class EmailValidator extends AbstractValidator {
    public validate(request: any): void {
        if(!request.email || !request.email.includes("@")) {
            throw new Error("Email inválido");
        }
        
        super.validate(request);
    }
}