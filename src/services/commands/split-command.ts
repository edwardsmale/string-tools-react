import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SplitCommand extends IndividualLineCommand {
    
    Name = "split"

    Help = {
        Desc: "Splits the text up",
        Para: [
            { name: "Separator", desc: "The string upon which to split" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        context.isArrayOfArrays = true;

        if (!para && context.regex) {

            return { segments: ["Split the text using the regex", context.regex] };
        }
        else if (!para && context.searchString) {

            return { segments: ["Split the text on", context.searchString] };
        }
        else {

            var defaultDelimiter = ",";
            para = para === "\\t" ? "\t" : para;
            var delimiter = para || defaultDelimiter;

            var formattedDelimiter = this.services.textUtilsService.FormatDelimiter(delimiter, false, true);

            return { segments: ["Split the text on every", formattedDelimiter] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                const split = this.splitScalar(value[i], para, negated, context);

                result.push(...split);
            }
            else {

                result.push(value[i]);
            }
        }

        context.isArrayOfArrays = true;
        context.columnInfo.headers = null;

        context.withIndices = this.services.arrayService.CreateRange(
            0,
            context.columnInfo.numberOfColumns
        );

        return result;
    }

    private splitScalar(value: string, para: string, negated: boolean, context: Context): string[] {

        if (!para && context.regex) {

            return value.split(new RegExp(context.regex));
        }
        else if (!para && context.searchString) {

            return value.split(context.searchString);
        }
        else {
            var defaultDelimiter = ",";
            para = para === "\\t" ? "\t" : para;
            var delimiter = para || defaultDelimiter;

            if (delimiter.length === 1 && "|^$*()\\/[].+".includes(delimiter)) {
                delimiter = "\\" + delimiter;
            }

            var splitValues = this.services.textUtilsService.Split(value as string, delimiter);

            context.columnInfo.numberOfColumns = Math.max(context.columnInfo.numberOfColumns, splitValues.length);

            return splitValues;
        }
    }
}