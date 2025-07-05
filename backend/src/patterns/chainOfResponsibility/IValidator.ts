export interface IValidator {
    setNext(handler: IValidator): IValidator;
    validate(request: any): void; 
}