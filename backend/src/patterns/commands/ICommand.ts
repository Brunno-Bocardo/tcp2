export interface ICommand {
    execute():Promise<any>
    search():Promise<any>
    undo():Promise<any>;
}