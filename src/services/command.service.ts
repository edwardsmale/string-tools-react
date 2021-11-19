import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { ScalarCommandType, ArrayCommandType, Explanation } from "../interfaces/CommandInterfaces";

export class CommandService {

    constructor(private textUtilsService: TextUtilsService, private commandParsingService: CommandParsingService, private commandTypesService: CommandTypesService, private contextService: ContextService) {
        this.textUtilsService = textUtilsService;
        this.commandParsingService = commandParsingService;
        this.commandTypesService = commandTypesService;
        this.contextService = contextService;
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

                    if (Array.isArray(currentValues)) {

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

                        let subValues: (string | string[])[] = [];
                        
                        for (let j = 0; j < currentValues.length; j++) {

                            const selectCommandType = this.commandTypesService.FindCommandType("select") as ScalarCommandType;

                            let selectedVal = selectCommandType.exec(
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

                    if (!parsedCommand.para || !this.textUtilsService.IsPositiveInteger(parsedCommand.para)) {

                        newValues[0] = this.FlattenValues(currentValues);

                    } else {
                        let batchSize = parseInt(parsedCommand.para, 10);
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
                    }
                } else {

                    // Not flat command.

                    // Iterate through the lines and apply the command.

                    if (scalarCommandType.isArrayBased && !Array.isArray(currentValues[0])) {

                        const newLineValue = scalarCommandType.exec(
                            currentValues as string[],
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,  
                            false
                        );

                        if (newLineValue !== null) {
                            newValues = newLineValue as string[];
                        }
                    }
                    else if (parsedCommand.commandType.name === "sort") {

                        var hasIndices = this.textUtilsService.ContainsSortOrderIndices(parsedCommand.para, context.columnInfo.headers);

                        if (!hasIndices) {

                            const flattenedValues = this.FlattenValues(currentValues);

                            const newLineValue = scalarCommandType.exec(
                                flattenedValues,
                                parsedCommand.para,
                                parsedCommand.negated,
                                context,     
                                false
                            );

                            if (newLineValue !== null) {
                                newValues = newLineValue as string[];
                            }
                        }
                        else {
                            
                            const newLineValue = scalarCommandType.exec(
                                currentValues as string[],
                                parsedCommand.para,
                                parsedCommand.negated,
                                context,  
                                false
                            );
    
                            if (newLineValue !== null) {
                                newValues = newLineValue as string[];
                            }
                        }
                    }
                    else if (parsedCommand.commandType.name === "distinct") {

                        const flattenedValues = this.FlattenValues(currentValues);

                        const newLineValue = scalarCommandType.exec(
                            flattenedValues,
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,
                            false
                        );

                        if (newLineValue !== null) {
                            newValues = newLineValue as string[];
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
                            );

                            if (newLineValue !== null) {
                                newValues.push(newLineValue as string);
                            }
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

    private FlattenValues(currentValues: (string | string[])[]) : string | string[] {

        if (!Array.isArray(currentValues[0])) {

            return currentValues as string[];
        }
        else {

            let flattened: string[] = [];

            for (let j = 0; j < currentValues.length; j++) {

                for (let k = 0; k < (currentValues[j] as string[]).length; k++) {
                    flattened.push(currentValues[j][k]);
                }
            }

            return flattened;
        }
    }
}