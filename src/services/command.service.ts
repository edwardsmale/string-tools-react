import { TextUtilsService } from './text-utils.service';
import { CommandParsingService } from './command-parsing.service';
import { CommandTypesService } from './command-types.service';
import { Context } from "../interfaces/Context";
import { CommandType, Explanation } from "../interfaces/CommandInterfaces";

export class CommandService {

    constructor(private textUtilsService: TextUtilsService, private commandParsingService: CommandParsingService, private commandTypesService: CommandTypesService) {
        this.textUtilsService = textUtilsService;
        this.commandParsingService = commandParsingService;
        this.commandTypesService = commandTypesService;
    }

    processCommands(codeValue: string, inputValue: string, explain: boolean): string[] {
        let codeLines = this.textUtilsService.TextToLines(codeValue);
        let lines = this.textUtilsService.TextToLines(inputValue);

        let context: Context = {
            isTabDelimited: this.textUtilsService.IsTabDelimited(lines),
            regex: null,
            searchString: null,
            isColumnNumeric: null
        };

        let currentValues: (string | string[])[] = lines;

        for (let i = 0; i < codeLines.length; i++) {

            let parsedCommand = this.commandParsingService.ParseCodeLine(
                codeLines[i]
            );

            let newValues: (string | string[])[] = [];

            if (parsedCommand.commandType.name === "flat") {

                if (!parsedCommand.para || !this.textUtilsService.IsPositiveInteger(parsedCommand.para)) {
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

                    newValues[0] = flattened;
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

                // Not flat|batch command.

                if (parsedCommand.commandType.name === "split") {
                    context.isColumnNumeric = [] as boolean[];
                }

                // Iterate through the lines and apply the command.

                if ((parsedCommand.commandType.isArrayBased && !Array.isArray(currentValues[0])) || parsedCommand.commandType.name === "sort") {

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

                } else {

                    let commandType = parsedCommand.commandType as CommandType;

                    for (let j = 0; j < currentValues.length; j++) {

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
                }
            }

            currentValues = newValues;
        }

        let outputLines: string[] = [];

        if (explain) {
            for (let i = 0; i < codeLines.length; i++) {
                let parsedCommand = this.commandParsingService.ParseCodeLine(codeLines[i]);
                let para = parsedCommand.para;
                let negated = parsedCommand.negated;
                let explanation = parsedCommand.commandType.exec(lines, para, negated, context, true) as Explanation;
                outputLines.push(explanation.explanation);
            }

            return outputLines;
        } else {

            for (let i = 0; i < currentValues.length; i++) {
                var value = currentValues[i];
                if (Array.isArray(value)) {
                    var arrayValue = value as string[];
                    for (let j = 0; j < arrayValue.length; j++) {
                        outputLines.push(arrayValue[j]);
                    }
                } else {
                    outputLines.push(value as string);
                }
            }

            return outputLines;
        }
    }
}