import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { ArrayService } from './array.service';
import { SortService } from './sort.service';
import { ScalarCommandType, ArrayCommandType, Explanation } from "../interfaces/CommandInterfaces";

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

    explainCommands(codeValue: string, lines: string[][], context: Context): Explanation[] {

        let codeLines = this.textUtilsService.TextToLines(codeValue);

        let output: Explanation[] = []; 

        for (let i = 0; i < codeLines.length; i++) {

            const parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
            const arrayCommandType = parsedCommand.commandType as ArrayCommandType;
            
            const explanation = arrayCommandType.exec(
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

    processCommands(codeValue: string, lines: (string | string[])[], context: Context): string[][] {

        try {
            let codeLines = this.textUtilsService.TextToLines(codeValue);

            let currentValues: (string | string[])[] = lines;

            context.newColumnInfo = {...context.columnInfo };

            for (let i = 0; i < codeLines.length; i++) {

                if (!codeLines[i].trim()) {
                    continue;
                }

                let parsedCommand = this.commandParsingService.ParseCodeLine(
                    codeLines[i]
                );

                const scalarCommandType = parsedCommand.commandType as ScalarCommandType;

                let newValues: (string | string[])[] = [];

                if (scalarCommandType.name === "with") {

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

                        let subValues: (string | string[])[] = [];
                        
                        for (let j = 0; j < currentValues.length; j++) {

                            const selectCommandType = this.commandTypesService.FindCommandType("select") as ScalarCommandType;

                            const selectedVal = selectCommandType.exec(
                                currentValues[j],
                                parsedCommand.para,
                                parsedCommand.negated,
                                subContext,
                                false
                            );

                            if (typeof selectedVal === "string" || Array.isArray(selectedVal)) {
                                subValues.push(selectedVal as string | string[]);
                            }
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
                else if (scalarCommandType.name === "flat") {

                    if (!this.textUtilsService.IsPositiveInteger(parsedCommand.para)) {

                        newValues[0] = this.arrayService.FlattenIfNecessary(currentValues);

                        context.isArrayOfArrays = false;

                    } else {

                        const batchSize = parseInt(parsedCommand.para, 10);
                        let batches = [];

                        let flattened: string[] = [];

                        for (let j = 0; j < currentValues.length; j++) {

                            if (Array.isArray(currentValues[j])) {

                                for (let k = 0; k < (currentValues[j] as string[]).length; k++) {

                                    const lines = this.textUtilsService.TextToLines(currentValues[j][k]);

                                    for (let l = 0; l < lines.length; l++) {
                                        flattened.push(lines[l]);

                                        if (flattened.length === batchSize) {
                                            batches.push(flattened);
                                            flattened = [];
                                        }
                                    }
                                }

                            } else {
                                flattened.push(currentValues[j] as string);

                                if (flattened.length === batchSize) {
                                    batches.push(flattened);
                                    flattened = [];
                                }
                            }
                        }

                        if (flattened.length) {
                            batches.push(flattened);
                        }

                        newValues = batches;

                        context.isArrayOfArrays = true;
                    }
                } else if (parsedCommand.commandType.name === "sort") {

                    const indices = this.textUtilsService.ParseSortOrderIndices(parsedCommand.para, context.columnInfo.headers);

                    const sortArray = this.sortService.SortArray;
                    const sortArrays = this.sortService.SortArrays;

                    if (!indices.length) {
    
                        const descending = parsedCommand.para.toLowerCase().indexOf("desc") !== -1;
                        
                        const flattenedValues = this.arrayService.FlattenIfNecessary(currentValues);

                        let sortedValues : string[];

                        if (flattenedValues.length === 1 && Array.isArray(flattenedValues[0])) {
                            
                            sortedValues = sortArray(flattenedValues[0] as string[]);
                        }
                        else {

                            sortedValues = sortArray(flattenedValues as string[]);
                        }

                        if (descending) {

                            sortedValues = sortedValues.reverse();
                        }

                        newValues = this.arrayService.Unflatten(sortedValues);
                    } 
                    else {

                        // Negative indices count back from the end.

                        for (let i = 0; i < indices.length; i++) {

                            if (indices[i].index < 0) {
                                indices[i].index += currentValues[0].length;
                            }
                        }

                        newValues = sortArrays(
                            currentValues as string[][], 
                            indices,
                            context
                        );
                    }
                }
                else if (parsedCommand.commandType.name === "distinct") {

                    const flattenedValues = this.arrayService.FlattenIfNecessary(currentValues);

                    const newLineValue = scalarCommandType.exec(
                        flattenedValues,
                        parsedCommand.para,
                        parsedCommand.negated,
                        context,
                        false
                    ) as string[];

                    if (newLineValue !== null) {
                        newValues = this.arrayService.UnflattenIfNecessary(newLineValue);
                    }
                    
                } else {

                    let startJ = 0;

                    if (scalarCommandType.name === "header") {

                        context.newColumnInfo.headers = null;

                        scalarCommandType.exec(
                            currentValues[0] as string,
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,
                            false
                        );

                        startJ = 1;
                    }

                    for (let j = startJ; j < currentValues.length; j++) {

                        const newLineValue = scalarCommandType.exec(
                            currentValues[j] as string,
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,
                            false
                        ) as string | string[] | null;

                        if (!this.arrayService.IsNullOrEmptyArray(newLineValue)) {
                            newValues.push(newLineValue as string | string[]);
                        }
                    }
                }

                this.contextService.UpdateContextDataTypes(context, newValues);

                currentValues = newValues;

                context.columnInfo = { ...context.newColumnInfo};
            }

            let output: string[][] = [];  
            
            if (Array.isArray(currentValues[0])) {

                for (let i = 0; i < currentValues.length; i++) {

                    output.push(currentValues[i] as string[]);
                }
            }
            else {

                for (let i = 0; i < currentValues.length; i++) {

                    output.push([currentValues[i] as string]);
                }
            }

            return output;
            
        } catch (ex) {

            let output:string[][] = [];
            output.push([ex.toString()]);

            return output;
        }
    }
}