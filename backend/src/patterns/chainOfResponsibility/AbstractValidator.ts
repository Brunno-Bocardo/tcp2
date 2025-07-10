import { IValidator } from "./IValidator";

export abstract class AbstractValidator implements IValidator {
    private nextValidation: IValidator | null = null;

    public setNext(handler: IValidator): IValidator {
        this.nextValidation = handler;
        return handler;
    }

    public validate(request: any): void {
        if(this.nextValidation) {
            this.nextValidation.validate(request)
        }
    }
}