import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class SplitCommand implements Command {
    
    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

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

            var formattedDelimiter = this.textUtilsService.FormatDelimiter(delimiter, false, true);

            return { segments: ["Split the text on every", formattedDelimiter] };
        }
    }

    ExecuteScalar(value: string[], para: string, negated: boolean, context: Context): string[] {

        return this.ExecuteArray(value, para, negated, context);
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        debugger;
        let result = [];

        for (let i = 0; i < value.length; i++) {

            const split = this.splitScalar(value[i], para, negated, context);

            result.push(...split);
        }

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

            var splitValues = this.textUtilsService.Split(value as string, delimiter);

            context.newColumnInfo.numberOfColumns = splitValues.length;
            context.newColumnInfo.headers = null;

            return splitValues;
        }
    }
}