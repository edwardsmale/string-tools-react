import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { ArrayService } from './array.service';
import { SortService } from './sort.service';
import { Command, IndividualLineCommand, WholeInputCommand, Explanation, ParsedCommand } from "../interfaces/CommandInterfaces";

export class CommandService {

    constructor(
        private textUtilsService: TextUtilsService,
        private commandParsingService: CommandParsingService,
        private commandTypesService: CommandTypesService,
        private contextService: ContextService,
        private arrayService: ArrayService,
        private sortService: SortService
    ) {
        this.textUtilsService = textUtilsService;
        this.commandParsingService = commandParsingService;
        this.commandTypesService = commandTypesService;
        this.contextService = contextService;
        this.arrayService = arrayService;
        this.sortService = sortService;
    }

    explainCommands(codeValue: string, lines: string[], context: Context): Explanation[] {

        const codeLines = this.textUtilsService.TextToLines(codeValue);

        let output: Explanation[] = []; 

        for (let i = 0; i < codeLines.length; i++) {

            const parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);

            const explanation = parsedCommand.command.Explain(
                parsedCommand.para,
                parsedCommand.negated,
                context
            );

            output.push(explanation);
        }

        return output;    
    }

    processCommands(codeValue: string, lines: string[][], context: Context): string[][] {

        //try {

            let updatedLines = lines;

            const codeLines = this.textUtilsService.TextToLines(codeValue);

            const parsedCommands: ParsedCommand[] = this.ParseCommands(codeLines);

            let startCommandIndex = 0;

            while (true) {

                let indexOfNextWholeInputCommand = parsedCommands.length;

                for (let c = startCommandIndex; c < parsedCommands.length; c++) {
        
                    if (parsedCommands[c].command.IsWholeInputCommand) {
        
                        indexOfNextWholeInputCommand = c;
                        break;
                    }
                }

                updatedLines = this.processIndividualLineCommands(
                    parsedCommands.slice(startCommandIndex, indexOfNextWholeInputCommand),
                    updatedLines,
                    context
                );

                if (indexOfNextWholeInputCommand === parsedCommands.length) {
                    break;
                }

                updatedLines = this.processWholeInputCommand(
                    parsedCommands[indexOfNextWholeInputCommand],
                    updatedLines,
                    context
                );

                startCommandIndex = indexOfNextWholeInputCommand + 1;
            }

            return updatedLines;
            
        // } catch (ex) {

        //     let output:string[][] = [];
        //     output.push([ex.toString()]);

        //     return output;
        // }
    }

    private processIndividualLineCommands(parsedCommands: ParsedCommand[], lines: string[][], context: Context): string[][] {

        let updatedLines: string[][] = [];
        
        for (let l = 0; l < lines.length; l++) {

            const originalLine = lines[l];
            let line = originalLine;

            context.withIndices = [0];
            context.columnInfo.numberOfColumns = 1;

            for (let c = 0; c < parsedCommands.length; c++) {

                const parsedCommand = parsedCommands[c];
                const command = parsedCommand.command as IndividualLineCommand;

                line = command.Execute(
                    line,
                    parsedCommand.para,
                    parsedCommand.negated,
                    context
                );

                if (command.UpdateContext) {

                    command.UpdateContext(
                        parsedCommand.para,
                        parsedCommand.negated,
                        context
                    );
                }
                
                if (!line || !line.length) {

                    break;
                }
            }

            if (line && line.length) {
                
                updatedLines.push(line);
            }
        }

        return updatedLines;
    }

    private processWholeInputCommand(parsedCommand: ParsedCommand, lines: string[][], context: Context): string[][] {

        return (parsedCommand.command as WholeInputCommand)
            .Execute(
                lines,
                parsedCommand.para,
                parsedCommand.negated,
                context
            );
    }

    private ParseCommands(codeLines: string[]) {

        let parsedCommands: ParsedCommand[] = [];

        for (let i = 0; i < codeLines.length; i++) {

            const parsedCommand = this.commandParsingService.ParseCodeLine(
                codeLines[i]
            );

            parsedCommands.push(parsedCommand);
        }

        return parsedCommands;
    }
}