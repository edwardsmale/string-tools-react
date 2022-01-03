import { Explanation, IndividualLineCommand, ParsedCommand, WholeInputCommand } from "../interfaces/CommandInterfaces";
import { Context } from "../interfaces/Context";
import { CommandParsingService } from './command-parsing.service';
import { Services } from './services';

export class CommandService {

    constructor(
        private services: Services,
        private commandParsingService: CommandParsingService
    ) {
        this.services = services;
        this.commandParsingService = commandParsingService;
    }

    explainCommands(codeValue: string, context: Context): Explanation[] {

        const codeLines = this.services.text.TextToLines(codeValue);

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

    processCommands(codeValue: string, lines: string[][]): string[][] {

        try {

            let context = this.services.context.CreateContext();

            let updatedLines = lines.slice(0);

            const codeLines = this.services.text.TextToLines(codeValue);

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

                context = this.services.context.CloneContext(this.firstLineContext);

                if (indexOfNextWholeInputCommand === parsedCommands.length) {
                    break;
                }

                updatedLines = this.processWholeInputCommand(
                    parsedCommands[indexOfNextWholeInputCommand],
                    updatedLines,
                    this.firstLineContext
                );

                context = this.services.context.CloneContext(this.firstLineContext);

                startCommandIndex = indexOfNextWholeInputCommand + 1;
            }

            return updatedLines;
            
        } catch (ex) {

            let output:string[][] = [];
            output.push([ex.toString()]);

            return output;
        }
    }

    public firstLineContext: Context = this.services.context.CreateContext();

    private processIndividualLineCommands(parsedCommands: ParsedCommand[], lines: string[][], originalContext: Context): string[][] {

        let firstLine = true;

        let delStart = -1;
        let delCount = 0;

        for (let l = 0; l < lines.length; l++) {

            let line = lines[l];

            let context = this.services.context.CloneContext(originalContext);

            for (let c = 0; c < parsedCommands.length && line.length; c++) {

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
            }

            if (line.length) {

                if (delCount) {

                    lines.splice(delStart, delCount);

                    l -= delCount;

                    delCount = 0;
                }
                
                lines[l] = line;

                if (firstLine) {

                    this.firstLineContext = this.services.context.CloneContext(context);

                    firstLine = false;
                }
            }
            else {

                if (delCount === 0) {

                    delStart = l;
                }

                delCount++;
            }
        }

        if (delCount) {

            lines.splice(delStart, delCount);
        }

        return lines;
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