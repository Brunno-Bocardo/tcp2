import { IValidator } from "./IValidator";

export abstract class AbstractValidatorAsync {
    private nextValidation: IValidator | null = null;

    public async validate(request: any): Promise<void> {
        if(this.nextValidation) {
            this.nextValidation.validate(request)
        }
    }
}