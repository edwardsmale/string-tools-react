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

            for (let l = 0; l < lines.length; l++) {

                const originalLine = lines[l];
                let line = originalLine;

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
                }

                updatedLines.push(line);
            }

            return updatedLines;




            let currentValues: string[][] = lines;

            context.newColumnInfo = {...context.columnInfo };

            for (let i = 0; i < parsedCommands.length; i++) {

                const parsedCommand = parsedCommands[i];

                const command = parsedCommand.command;

                let newValues: string[][] = [];

                if (command.Name === "with") {

                    if (context.isArrayOfArrays) {

                        let subCommands = [];

                        let j = i + 1;

                        while (j < codeLines.length && codeLines[j].startsWith("  ")) {

                            subCommands.push(codeLines[j].replace("  ", ""));

                            j++;
                        }

                        const subCode = subCommands.join("\n");

                        const subPara = this.textUtilsService.ReplaceHeadersWithIndexes(
                            parsedCommand.para,
                            context.columnInfo.headers
                        );

                        const indices = this.textUtilsService.ParseIntegers(subPara);

                        let subContext = this.contextService.CloneContext(context);

                        subContext.isArrayOfArrays = false;

                        let subValues: string[][] = [];
                        
                        for (let j = 0; j < currentValues.length; j++) {

                            const selectCommand = this.commandTypesService.CreateCommand("select");

                            const selectedVal = selectCommand.Execute(
                                currentValues[j],
                                parsedCommand.para,
                                parsedCommand.negated,
                                subContext
                            );

                            subValues.push(selectedVal);
                        }

                        const subResult = this.processCommands(subCode, subValues, subContext);

                        for (let j = 0; j < currentValues.length; j++) {

                            let resultRow: string[] = [];

                            for (let k = 0; k < currentValues[j].length; k++) {

                                if (indices.includes(k)) {
                                    
                                    resultRow.push(subResult[j].join("\n"));
                                }
                                else {
                                    
                                    resultRow.push(currentValues[j][k]);
                                }
                            }

                            newValues.push(resultRow);
                        }

                        i = j - 1;
                    }
                }
                else if (command.Name === "flat") {

                    let batchSize = this.textUtilsService.ParsePositiveInteger(parsedCommand.para);

                    if (batchSize === null) {

                        batchSize = 1;
                    }
                  
                    let batches = [];

                    let batch: string[] = [];

                    for (let j = 0; j < currentValues.length; j++) {

                        for (let k = 0; k < currentValues[j].length; k++) {

                            batch.push(lines[j][k]);

                            if (batch.length === batchSize) {
                                batches.push(batch);
                                batch = [];
                            }
                        }
                    }

                    if (batch.length) {
                        batches.push(batch);
                    }

                    newValues = batches;

                    context.isArrayOfArrays = batchSize > 1;
                }
                else if (command.Name === "sort") {

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
                else if (command.Name === "distinct") {

                    // Using an object and adding keys to it seems to be much faster than using Array.includes.

                    let obj: any = {};

                    let arr: string[] = [];

                    for (let i = 0; i < currentValues.length; i++) {

                        for (let j = 0; j < currentValues[i].length; j++) {

                            if (!obj[currentValues[i][j]]) {

                                obj[currentValues[i][j]] = "a";

                                arr.push(currentValues[i][j]);
                            }
                        }

                        if (arr.length > 0) {

                            newValues.push(arr);
                            arr = [];
                        }
                    }
                }
                else {

                    if (command.Name === "header") {

                        context.newColumnInfo.headers = currentValues[0];

                        newValues = currentValues.slice(1);
                    }
                    else {

                        for (let j = 0; j < currentValues.length; j++) {

                            const newValue = command.Execute(
                                currentValues[j],
                                parsedCommand.para,
                                parsedCommand.negated,
                                context
                            );

                            if (newValue.length) {

                                newValues.push(newValue);
                            }
                        }
                    }
                }

                if (command.UpdateContext) {

                    command.UpdateContext(parsedCommand.para, parsedCommand.negated, context);
                }
                
                this.contextService.UpdateContextDataTypes(context, newValues);

                currentValues = newValues;

                context.columnInfo = { ...context.newColumnInfo};
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