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

        const codeLines = this.services.text.TextToLines(codeValue);
        const parsedCommands: ParsedCommand[] = this.ParseCommands(codeLines, inputHash);

        let lines: string[][];
        let context: Context;
        
        const indexOfFurthestCachedCommand = this.getIndexOfFurthestCachedCommand(parsedCommands);

        if (indexOfFurthestCachedCommand >= 0) {

            const furthestCachedCommand = parsedCommands[indexOfFurthestCachedCommand];

            const cachedItem = this.outputCache[furthestCachedCommand.cumulativeHash];

            lines = cachedItem.output;
            context = cachedItem.context;

            lines = this.processParsedCommands(parsedCommands, lines, context, indexOfFurthestCachedCommand + 1, parsedCommands.length);           
        }
        else {

            lines = input.map(function (val) { return [val]; });
            context = this.services.context.CreateContext();

            lines = this.processParsedCommands(parsedCommands, lines, context, 0, parsedCommands.length);           
        }

        const cacheKey = parsedCommands[parsedCommands.length - 1].cumulativeHash;

        if (!this.outputCache[cacheKey]) {

            this.outputCache[cacheKey] = {

                context: this.services.context.CloneContext(this.firstLineContext),
                parsedCommands: parsedCommands.map(pc => pc.command.Name).join(", "),
                output: lines
            };
        }

        console.log(indexOfFurthestCachedCommand);

        let indexToCache = 0;

        while (
            indexToCache < parsedCommands.length - 1 &&
            this.outputCache[parsedCommands[indexToCache].cumulativeHash]) {

            indexToCache++;
        }

        const parsedCommandToCache = parsedCommands[indexToCache];

        if (parsedCommandToCache.dataSizeAfterCommand < 1024 * 1024 * 256) {

            const tempCacheKey = parsedCommandToCache.cumulativeHash;

            if (!this.outputCache[tempCacheKey]) {

                console.log("Caching index: " + indexToCache);

                let tempLines = input.map(function (val) { return [val]; });
                let tempContext = this.services.context.CreateContext();

                // Recreate all the ParsedCommands, to reset commands like 'header' and 'distinct' which have properties.
                const tempParsedCommands: ParsedCommand[] = this.ParseCommands(codeLines, inputHash).slice(0, indexToCache + 1);

                tempLines = this.processParsedCommands(tempParsedCommands, tempLines, tempContext, 0, tempParsedCommands.length);

                this.outputCache[tempCacheKey] = {

                    context: this.services.context.CloneContext(this.firstLineContext),
                    parsedCommands: tempParsedCommands.map(pc => pc.command.Name).join(", "),
                    output: tempLines
                };
            }
        }

        return lines;
    }

    private getIndexOfFurthestCachedCommand(parsedCommands: ParsedCommand[]) {

        return -1; // TODO: Fix caching, it doesn't work.

        // for (let c = parsedCommands.length - 1; c > 0; c--) {

        //     if (this.outputCache[parsedCommands[c].cumulativeHash]) {
        //         return c;
        //     }
        // }

        // return -1;
    }

    private processParsedCommands(parsedCommands: ParsedCommand[], lines: string[][], originalContext: Context, desiredStartIndex: number, desiredStopIndex: number) {

        let updatedLines = lines.slice(0);

        let context = this.services.context.CloneContext(originalContext);

        let commandIndex = desiredStartIndex;

        while (commandIndex < desiredStopIndex) {

            let stopIndex = this.getIndexOfNextWholeInputCommand(parsedCommands, commandIndex);

            stopIndex = Math.min(stopIndex, desiredStopIndex);

            updatedLines = this.processIndividualLineCommands(
                parsedCommands.slice(commandIndex, stopIndex),
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

                commandIndex++;
            }
        }

        return updatedLines;
    }

    getIndexOfNextWholeInputCommand(parsedCommands: ParsedCommand[], start: number) {

        let index = start;

        while (index < parsedCommands.length) {

            if (parsedCommands[index].command.IsWholeInputCommand) {

                return index;
            }

            index++;
        }

        return parsedCommands.length;
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

        parsedCommand.dataSizeAfterCommand = this.services.text.GetDataSize(updatedLines);

        return updatedLines;
    }

    private ParseCommands(codeLines: string[], cumulativeHash: number) {

        let parsedCommands: ParsedCommand[] = [];

        let count = 0;

        for (let i = 0; i < codeLines.length; i++) {

            const parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
            
            if (parsedCommand.command.Name !== "noop") {

                const hash = this.services.text.GenerateHash(count.toString() + parsedCommand.command.Name + " " + parsedCommand.para);

                cumulativeHash = cumulativeHash ^ hash;

                count++;
            }

            parsedCommand.cumulativeHash = cumulativeHash;

            parsedCommands.push(parsedCommand);
        }

        return parsedCommands;
    }
}