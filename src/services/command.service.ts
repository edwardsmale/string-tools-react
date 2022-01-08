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

    private outputCache: any = {};

    processCommands(codeValue: string, input: string[], inputHash: number): string[][] {

        let lines: string[][] = input.map(function (val) { return [val]; });

        try {

            let context = this.services.context.CreateContext();

            const codeLines = this.services.text.TextToLines(codeValue);

            const parsedCommands: ParsedCommand[] = this.ParseCommands(codeLines, inputHash);
            
            const cacheKey = parsedCommands[parsedCommands.length - 1].cumulativeHash;

            const cachedItem = this.outputCache[cacheKey];

            if (cachedItem) {

                return cachedItem.output;
            }
            else {

                lines = this.processParsedCommands(parsedCommands, lines, context, 0, parsedCommands.length);

                this.outputCache[cacheKey] = {

                    context: context,
                    output: lines
                };

                return lines;
            }
            
        } catch (ex) {

            return [[ex.toString()]];
        }
    }

    private processParsedCommands(parsedCommands: ParsedCommand[], lines: string[][], originalContext: Context, desiredStartIndex: number, desiredStopIndex: number) {

        let updatedLines = lines.slice(0);

        let context = this.services.context.CloneContext(originalContext);

        let commandIndex = desiredStartIndex;

        while (commandIndex < desiredStopIndex) {

            let stopIndex = this.getIndexOfNextWholeInputCommand(parsedCommands, commandIndex);

            stopIndex = Math.min(stopIndex, desiredStopIndex);

            updatedLines = this.processIndividualLineCommands(
                parsedCommands.slice(desiredStartIndex, stopIndex),
                updatedLines,
                context
            );

            context = this.services.context.CloneContext(this.firstLineContext);

            commandIndex = stopIndex;

            while (commandIndex < desiredStopIndex && parsedCommands[commandIndex].command.IsWholeInputCommand) {

                updatedLines = this.processWholeInputCommand(
                    parsedCommands[commandIndex],
                    updatedLines,
                    this.firstLineContext
                );

                context = this.services.context.CloneContext(this.firstLineContext);

                commandIndex++;
            }
        }

        return updatedLines;
    }

    getIndexOfNextWholeInputCommand(parsedCommands: ParsedCommand[], start: number) {

        const index = parsedCommands.slice(start).findIndex(pc => { return pc.command.IsWholeInputCommand; });

        return index === -1 ? parsedCommands.length : index;
    }

    public firstLineContext: Context = this.services.context.CreateContext();

    private processIndividualLineCommands(parsedCommands: ParsedCommand[], lines: string[][], originalContext: Context): string[][] {

        let firstLine = true;

        let delStart = -1;
        let delCount = 0;

        for (let c = 0; c < parsedCommands.length; c++) {

            parsedCommands[c].dataSizeAfterCommand = 0;
        }

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

                for (let i = 0; i < line.length; i++) {

                    parsedCommands[c].dataSizeAfterCommand += line[i].length;
                }

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

        const updatedLines = (parsedCommand.command as WholeInputCommand)
            .Execute(
                lines,
                parsedCommand.para,
                parsedCommand.negated,
                context
            );

        parsedCommand.dataSizeAfterCommand = this.services.text.CountLines2(updatedLines);

        return updatedLines;
    }

    private ParseCommands(codeLines: string[], cumulativeHash: number) {

        let parsedCommands: ParsedCommand[] = [];

        for (let i = 0; i < codeLines.length; i++) {

            const parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
            
            const hash = this.services.text.GenerateHash(codeLines[i]);

            cumulativeHash = cumulativeHash ^ hash;

            parsedCommand.cumulativeHash = cumulativeHash;

            parsedCommands.push(parsedCommand);
        }

        return parsedCommands;
    }
}