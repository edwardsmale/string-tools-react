import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { CommandType, Explanation } from "../interfaces/CommandInterfaces";

export class CommandService {

    constructor(private textUtilsService: TextUtilsService, private commandParsingService: CommandParsingService, private commandTypesService: CommandTypesService, private contextService: ContextService) {
        this.textUtilsService = textUtilsService;
        this.commandParsingService = commandParsingService;
        this.commandTypesService = commandTypesService;
        this.contextService = contextService;
    }

    processCommands(codeValue: string, inputValue: string, explain: boolean): string[][] {

        try {
            let codeLines = this.textUtilsService.TextToLines(codeValue);
            let lines = this.textUtilsService.TextToLines(inputValue);

            let context: Context = {
                isTabDelimited: this.textUtilsService.IsTabDelimited(lines),
                regex: null,
                searchString: null,
                numberOfColumns: null,
                isColumnNumeric: null,
                isColumnIntegral: null,
                headers: null
            };

            let currentValues: (string | string[])[] = lines;

            for (let i = 0; i < codeLines.length; i++) {

                if (!codeLines[i].trim()) {
                    continue;
                }

                let parsedCommand = this.commandParsingService.ParseCodeLine(
                    codeLines[i]
                );

                let newValues: (string | string[])[] = [];

                if (parsedCommand.commandType.name === "flat") {

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

                    if (parsedCommand.commandType.name === "split") {
                        context.isColumnNumeric = [] as boolean[];
                    }

                    // Iterate through the lines and apply the command.

                    if ((parsedCommand.commandType.isArrayBased && !Array.isArray(currentValues[0]))) {

                        const newLineValue = parsedCommand.commandType.exec(
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
                    else if (parsedCommand.commandType.name === "sort" || parsedCommand.commandType.name === "distinct") {

                        const flattenedValues = this.FlattenValues(currentValues);

                        const newLineValue = parsedCommand.commandType.exec(
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

                        let commandType = parsedCommand.commandType as CommandType;

                        if (explain) {

                            const newLineValue = commandType.exec(
                                "dummy value",
                                parsedCommand.para,
                                parsedCommand.negated,
                                context,
                                explain
                            );

                            if (newLineValue !== null) {
                                newValues.push(newLineValue as string);
                            }
                        }
                        else {

                            let startJ = 0;

                            if (commandType.name === "header") {

                                context.headers = null;

                                commandType.exec(
                                    currentValues[0] as string,
                                    parsedCommand.para,
                                    parsedCommand.negated,
                                    context,
                                    explain
                                );

                                startJ = 1;

                                this.contextService.UpdateContextDataTypes(context, (currentValues.slice(1)) as string[][]);
                            }

                            for (let j = startJ; j < currentValues.length; j++) {

                                const newLineValue = commandType.exec(
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

                            if (commandType.name === "split") {

                                this.contextService.UpdateContextDataTypes(context, newValues as string[][]);
                            }
                        }
                    }
                }

                currentValues = newValues;
            }

            let output: string[][] = [];

            if (explain) {

                for (let i = 0; i < codeLines.length; i++) {
                    let parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
                    let para = parsedCommand.para;
                    let negated = parsedCommand.negated;
                    let explanation = parsedCommand.commandType.exec(lines, para, negated, context, true) as Explanation;
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