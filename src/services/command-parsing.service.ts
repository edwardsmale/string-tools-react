import { CommandTypesService } from './command-types.service';
import { ParsedCommand } from "../interfaces/CommandInterfaces";

export class CommandParsingService {

  constructor(private commandTypesService : CommandTypesService) {

    this.commandTypesService = commandTypesService;
  }

  ParseCodeLine = (codeLine: string): ParsedCommand => {
    
    if (codeLine.length === 0) {
      
      return {
        command: this.commandTypesService.FindCommand("noop"),
        para: "",
        negated: false
      };

    } else {
      
      const commandString = codeLine.indexOf(" ") !== -1 ? codeLine.substr(0,codeLine.indexOf(" ")) : codeLine;
      const paraString = codeLine.indexOf(" ") !== -1 ? codeLine.substr(codeLine.indexOf(" ") + 1) : "";

      const negated = commandString.includes("!");
      const commandName = commandString.replace("!", "");
      const command = this.commandTypesService.FindCommand(commandName);

      return {
        command: command,
        para: paraString,
        negated: negated
      };
    }
  }
}