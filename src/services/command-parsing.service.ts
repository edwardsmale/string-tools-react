import { CommandTypesService } from './command-types.service';
import { ParsedCommand } from "../interfaces/CommandInterfaces";
import { Services } from "../services/services";

export class CommandParsingService {

  constructor(private services: Services, private commandTypesService: CommandTypesService) {

    this.services = services;
    this.commandTypesService = commandTypesService;
  }

  ParseCodeLine = (codeLine: string): ParsedCommand => {
    
    if (codeLine.length === 0) {
      
      return {
        command: this.commandTypesService.CreateCommand("noop"),
        para: "",
        negated: false,
        cumulativeHash: 0
      };

    } else {
      
      const indexOfSpace = codeLine.indexOf(" ");

      const commandString = indexOfSpace !== -1 ? codeLine.substring(0, indexOfSpace) : codeLine;
      const para = indexOfSpace !== -1 ? codeLine.substring(indexOfSpace + 1) : "";

      const negated = commandString.includes("!");
      const commandName = commandString.replace("!", "");
      const command = this.commandTypesService.CreateCommand(commandName);

      return {
        command: command,
        para: para,
        negated: negated,
        cumulativeHash: 0
      };
    }
  }
}