import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class PrintCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {
        
        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["print", para] };
    }

    ExecuteScalar(value: string[], para: string, negated: boolean, context: Context): string[] {

        return this.ExecuteArray(value, para, negated, context);
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        var result = this.textUtilsService.ReplaceBackslashTWithTab(para);

        // Replace $header

        if (Array.isArray(context.columnInfo.headers)) {

            const headersOrderedByLength = this.textUtilsService.GetHeadersOrderedByLength(
                context.columnInfo.headers
            );

            for (let i = 0; i < headersOrderedByLength.length; i++) {

                let header = headersOrderedByLength[i].header;
                let index = headersOrderedByLength[i].index;

                const regex = new RegExp("\\$" + header, "g");
                const replacement = value[index];

                result = result.replace(regex, replacement);
            }
        }

        result = this.ReplacePositionals(result, value);
        
        context.newColumnInfo.headers = [];

        return [result];
    }

    private ReplacePositionals(result: string, arrayValue: string[]) {

        // Replace $[n]
        
        for (let i = 0; i < arrayValue.length; i++) {
            result = result.replace(new RegExp("\\$\\[" + i + "\\]", "g"), arrayValue[i]);
        }

        // Replace $[-n]

        for (let i = 0; i < arrayValue.length; i++) {
            result = result.replace(new RegExp("\\$\\[-" + i + "\\]", "g"), arrayValue[arrayValue.length - i]);
        }

        return result;
    }
}