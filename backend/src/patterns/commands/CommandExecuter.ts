import { ICommand } from "./ICommand";

export class CommandExecuter {
    async run(command: ICommand): Promise<any> {
        console.log("Executando comando...");
        return await command.execute();
    }
}