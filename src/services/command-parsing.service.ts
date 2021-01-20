import { TextUtilsService } from './text-utils.service';
import { CommandTypesService } from './command-types.service';
import { ParsedCommand } from "../interfaces/CommandInterfaces";

export class CommandParsingService {

  constructor(private textUtilsService : TextUtilsService, private commandTypesService : CommandTypesService) {
    this.textUtilsService = textUtilsService;
    this.commandTypesService = commandTypesService;
  }

  ParseCodeLine = (codeLine: string): ParsedCommand => {
    codeLine = codeLine.trim();
    if (codeLine.length === 0) {
      return {
        commandType: this.commandTypesService.FindCommandType("noop"),
        para: "",
        negated: false
      };
    } else {
      
      var commandString = codeLine.indexOf(" ") !== -1 ? codeLine.substr(0,codeLine.indexOf(" ")) : codeLine;
      var paraString = codeLine.indexOf(" ") !== -1 ? codeLine.substr(codeLine.indexOf(" ") + 1) : "";

      var negated = commandString.includes("!");
      var commandName = commandString.replace("!", "");
      var commandType = this.commandTypesService.FindCommandType(commandName);
      var para = paraString;

      return {
        commandType: commandType,
        para: para,
        negated: negated
      };
    }
  }
}