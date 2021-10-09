import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { ScalarCommandType, ArrayCommandType, Explanation, CommandType } from "../interfaces/CommandInterfaces";

export class CommandService {

    constructor(private textUtilsService: TextUtilsService, private commandParsingService: CommandParsingService, private commandTypesService: CommandTypesService, private contextService: ContextService) {
        this.textUtilsService = textUtilsService;
        this.commandParsingService = commandParsingService;
        this.commandTypesService = commandTypesService;
        this.contextService = contextService;
    }

    processCommands(codeValue: string, lines: (string | string[])[], explain: boolean, context: Context): string[][] {

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

                const commandType = parsedCommand.commandType as CommandType;

                const scalarCommandType = parsedCommand.commandType as ScalarCommandType;
                const arrayCommandType = parsedCommand.commandType as ArrayCommandType;

                let newValues: (string | string[])[] = [];

                if (explain) {

                    if (commandType.name === "with") {

                        newValues.push("with (explanation TODO)");
                    }
                    else {

                        const newLineValue = arrayCommandType.exec(
                            ["d"],
                            parsedCommand.para,
                            parsedCommand.negated,
                            context,                      
                            explain
                        );

                        if (newLineValue !== null) {
                            newValues.push(newLineValue as string);
                        }
                    }
                }
                else {

                    if (commandType.name === "with") {

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

                            let subResult = this.processCommands(subCode, subValues, false, subContext);

                            for (let j = 0; j < currentValues.length; j++) {

                                let resultRow: string[] = [];
                                let subIndex = 0;

                                for (let k = 0; k < currentValues[j].length; k++) {

                                    if (indices.includes(k)) {
                                        resultRow.push(subResult[j][subIndex++]);
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

                        if (!parsedCommand.para || !this.textUtilsService.IsPositiveInteger(parsedCommand.para)) {

                            newValues[0] = this.FlattenValues(currentValues);

                        } else {
                            let batchSize = parseInt(parsedCommand.para, 10);
                            let batches = [];

                            let flattened: string[] = [];

                            for (let j = 0; j < currentValues.length; j++) {

                                if (Array.isArray(currentValues[j])) {

                                    for (let k = 0; k < (currentValues[j] as string[]).length; k++) {
                                        flattened.push(currentValues[j][k]);

                                        if (flattened.length === batchSize) {
                                            batches.push(flattened);
                                            flattened = [];
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

                        if (commandType.isArrayBased && !Array.isArray(currentValues[0])) {

                            const newLineValue = scalarCommandType.exec(
                                currentValues as string[],
                                parsedCommand.para,
                                parsedCommand.negated,
                                context,  
                                explain
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
                                    explain
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
                                    explain
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
                                explain
                            );

                            if (newLineValue !== null) {
                                newValues = newLineValue as string[];
                            }
                            
                        } else {

                            let startJ = 0;

                            if (commandType.name === "header") {

                                context.newColumnInfo.headers = null;

                                scalarCommandType.exec(
                                    currentValues[0] as string,
                                    parsedCommand.para,
                                    parsedCommand.negated,
                                    context,
                                    explain
                                );

                                startJ = 1;
                            }

                            for (let j = startJ; j < currentValues.length; j++) {

                                const newLineValue = scalarCommandType.exec(
                                    currentValues[j] as string,
                                    parsedCommand.para,
                                    parsedCommand.negated,
                                    context,
                                    explain
                                );

                                if (newLineValue !== null) {
                                    newValues.push(newLineValue as string);
                                }
                            }
                        }
                    }
                }
                
                if (!explain) {
                    this.contextService.UpdateContextDataTypes(context, newValues);
                }

                currentValues = newValues;

                context.columnInfo = { ...context.newColumnInfo};
            }

            let output: string[][] = [];

            if (explain) {

                for (let i = 0; i < codeLines.length; i++) {
                    const parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
                    const arrayCommandType = parsedCommand.commandType as ArrayCommandType;
                    const para = parsedCommand.para;
                    const negated = parsedCommand.negated;
                    const explanation = arrayCommandType.exec(lines, para, negated, context, true) as Explanation;
                    output.push([explanation.explanation]);
                }

                return output;

            } else {

                for (let i = 0; i < currentValues.length; i++) {
                    var value = currentValues[i];
                    if (Array.isArray(value)) {
                        var arrayValue = value as string[];
                        output.push(arrayValue);
                    } else {
                        output.push([value as string]);
                    }
                }

                return output;
            }
        } catch (ex) {

            let output:string[][] = [];
            output.push([ex.toString()]);

            return output;
        }
    }

    private FlattenValues(currentValues: (string | string[])[]) {

        let allScalar = true;

        for (let j = 0; j < currentValues.length; j++) {
            
            if (Array.isArray(currentValues[j])) {

                allScalar = false;
                break;
            }
        }

        if (allScalar) {
            return currentValues as string[];
        }

        let flattened: string[] = [];

        for (let j = 0; j < currentValues.length; j++) {

            if (Array.isArray(currentValues[j])) {

                for (let k = 0; k < (currentValues[j] as string[]).length; k++) {
                    flattened.push(currentValues[j][k]);
                }

            } else {
                flattened.push(currentValues[j] as string);
            }
        }

        return flattened;
    }
}