import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { ArrayService } from './array.service';
import { SortService } from './sort.service';
import { CommandType, Explanation } from "../interfaces/CommandInterfaces";

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

        let codeLines = this.textUtilsService.TextToLines(codeValue);

        let output: Explanation[] = []; 

        for (let i = 0; i < codeLines.length; i++) {

            const parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
            const commandType = parsedCommand.commandType as CommandType;

            const explanation = commandType.exec(
                lines,
                parsedCommand.para,
                parsedCommand.negated,
                context,
                true
            ) as Explanation;

            output.push(explanation);
        }

        return output;    
    }

    processCommands(codeValue: string, lines: string[][], context: Context): string[][] {

        //try {
            let codeLines = this.textUtilsService.TextToLines(codeValue);

            let currentValues: string[][] = lines;

            context.newColumnInfo = {...context.columnInfo };

            for (let i = 0; i < codeLines.length; i++) {

                if (!codeLines[i].trim()) {
                    continue;
                }

                const parsedCommand = this.commandParsingService.ParseCodeLine(
                    codeLines[i]
                );

                const commandType = parsedCommand.commandType as CommandType;

                let newValues: string[][] = [];

                if (commandType.name === "with") {

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

                            const selectCommandType = this.commandTypesService.FindCommandType("select") as CommandType;

                            const selectedVal = selectCommandType.exec(
                                currentValues[j],
                                parsedCommand.para,
                                parsedCommand.negated,
                                subContext,
                                false
                            ) as string[];

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
                else if (commandType.name === "flat") {

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
                else if (parsedCommand.commandType.name === "sort") {

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
                                ascending: true,
                                description: "the item at index 0"
                            }];

                            newValues = this.sortService.SortArrays(
                                currentValues, 
                                indices,
                                context
                            );    
                        }                   
                        else {

                            let sortedValues = this.sortService.SortArray(
                                currentValues
                            );

                            if (descending) {

                                sortedValues = sortedValues.reverse();
                            }

                            newValues = sortedValues;
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

                            let sortedValues = this.sortService.SortArray(
                                currentValues
                            );

                            if (descending) {

                                sortedValues = sortedValues.reverse();
                            }

                            newValues = sortedValues;
                        }
                    }
                }
                else if (parsedCommand.commandType.name === "distinct") {

                    const flattenedValues = this.arrayService.FlattenIfNecessary(currentValues);

                    const newLineValue = commandType.exec(
                        flattenedValues,
                        parsedCommand.para,
                        parsedCommand.negated,
                        context,
                        false
                    ) as string[];

                    if (newLineValue !== null) {
                        newValues = this.arrayService.UnflattenIfNecessary(newLineValue);
                    }                    
                }
                else {

                    let startJ = 0;

                    if (commandType.name === "header") {

                        context.newColumnInfo.headers = null;

                        commandType.exec(
                            currentValues[0],
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,
                            false
                        );

                        startJ = 1;
                    }

                    for (let j = startJ; j < currentValues.length; j++) {

                        const newLineValue = commandType.exec(
                            currentValues[j],
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,
                            false
                        );

                        newValues.push(newLineValue as string[]);
                    }
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
}