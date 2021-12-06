import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { ArrayService } from './array.service';
import { SortService } from './sort.service';
import { Command, Explanation, ParsedCommand } from "../interfaces/CommandInterfaces";

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

            const codeLines = this.textUtilsService.TextToLines(codeValue);

            const parsedCommands: ParsedCommand[] = this.ParseCommands(codeLines);

            let updatedLines: string[][] = [];

            const originalContext = this.contextService.CloneContext(context);

            for (let l = 0; l < lines.length; l++) {

                const originalLine = lines[l];
                let line = originalLine;

                context.withIndices = [...originalContext.withIndices];
                context.columnInfo.numberOfColumns = originalContext.columnInfo.numberOfColumns;

                for (let c = 0; c < parsedCommands.length; c++) {

                    const parsedCommand = parsedCommands[c];
                    const command = parsedCommand.command;

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
                    
                    if (!line.length) {

                        break;
                    }
                }

                if (line.length) {
                    
                    updatedLines.push(line);
                }
            }

            return updatedLines;




            let currentValues: string[][] = lines;

            for (let i = 0; i < parsedCommands.length; i++) {

                const parsedCommand = parsedCommands[i];

                const command = parsedCommand.command;

                let newValues: string[][] = [];

                if (command.Name === "sort") {

                    let indices = this.textUtilsService.ParseSortOrderIndices(
                        parsedCommand.para,
                        context.columnInfo.headers
                    );

                    const descending = this.textUtilsService.ParseSortOrderIsDescending(parsedCommand.para);

                    if (!indices.length) {

                        if (context.isArrayOfArrays) {

                            // TODO: Decide how to sort an array of arrays when no indices are specified.

                            // For now just sort by index 0.

                            indices = [{
                                index: 0,
                                descending: descending,
                                description: "the item at index 0"
                            }];

                            newValues = this.sortService.SortArrays(
                                currentValues, 
                                indices,
                                context
                            );
                        }                   
                        else {

                            newValues = this.sortService.SortArray(
                                currentValues,
                                descending
                            );
                        }
                    } 
                    else {

                        if (context.isArrayOfArrays) {

                            // Negative indices count back from the end.

                            for (let i = 0; i < indices.length; i++) {

                                if (indices[i].index < 0) {
                                    indices[i].index += currentValues[0].length;
                                }
                            }

                            newValues = this.sortService.SortArrays(
                                currentValues, 
                                indices,
                                context
                            );
                        }
                        else {

                            newValues = this.sortService.SortArray(
                                currentValues,
                                descending
                            );
                        }
                    }
                }
            }

            return currentValues;
            
        // } catch (ex) {

        //     let output:string[][] = [];
        //     output.push([ex.toString()]);

        //     return output;
        // }
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