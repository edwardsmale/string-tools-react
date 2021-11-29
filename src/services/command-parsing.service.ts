import { CommandTypesService } from './command-types.service';
import { ParsedCommand } from "../interfaces/CommandInterfaces";

export class CommandParsingService {

  constructor(private commandTypesService : CommandTypesService) {

    this.commandTypesService = commandTypesService;
  }

  ParseCodeLine = (codeLine: string): ParsedCommand => {
    
    if (codeLine.length === 0) {
      
      return {
        command: this.commandTypesService.CreateCommand("noop"),
        para: "",
        negated: false
      };

    } else {
      
      const indexOfSpace = codeLine.indexOf(" ");

      const commandString = indexOfSpace !== -1 ? codeLine.substr(0, indexOfSpace) : codeLine;
      const para = indexOfSpace !== -1 ? codeLine.substr(indexOfSpace + 1) : "";

      const negated = commandString.includes("!");
      const commandName = commandString.replace("!", "");
      const command = this.commandTypesService.CreateCommand(commandName);

      return {
        command: command,
        para: para,
        negated: negated
      };
    }
  }
}