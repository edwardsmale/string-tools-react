import { TextUtilsService } from './text-utils.service';
import { CommandTypesService } from './command-types.service';
import { ParsedCommand } from "../interfaces/CommandInterfaces";

export class CommandParsingService {

  constructor(private textUtilsService : TextUtilsService, private commandTypesService : CommandTypesService) {
    this.textUtilsService = textUtilsService;
    this.commandTypesService = commandTypesService;
  }

  ParseCodeLine = (codeLine: string): ParsedCommand => {
    var codeLine = codeLine.trim();
    if (codeLine.length === 0) {
      return {
        commandType: this.commandTypesService.FindCommandType("noop"),
        para: "",
        negated: false
      };
    } else {
      var codeLineSplit = codeLine.split(/\s+/);
      var negated = codeLineSplit[0].includes("!");
      var commandName = codeLineSplit[0].replace("!", "");
      var commandType = this.commandTypesService.FindCommandType(commandName);
      var para = codeLine.replace("!", "").replace(commandName, "").trim();
      
      return {
        commandType: commandType,
        para: para,
        negated: negated
      };
    }
  }
}