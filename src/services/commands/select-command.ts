import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class SelectCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

        const indices = this.textUtilsService.ParseIntegers(para);

        if (indices.some((i) => isNaN(i))) {

            return { segments: ["Get the specified columns"] };
        }
        else if (indices.some((i) => i < 0)) {

            let formattedIndices: string[] = [];

            for (let i = 0; i < indices.length; i++) {

                var formattedIndex = this.textUtilsService.FormatIndex(indices[i], true);

                formattedIndices.push(formattedIndex);
            }

            const positions = this.textUtilsService.FormatList(formattedIndices);

            return { segments: ["Get", positions] };
        }
        else {

            const positions = this.textUtilsService.FormatList(indices);

            if (indices.length > 1) {

                return { segments: ["Get the items at indexes", positions] };
            }
            else {
                return { segments: ["Get the items at index", positions] };
            }
        }
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string[] {
        
        return [value];
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

        const indices = this.textUtilsService.ParseIntegers(para);

        let result: string[] = [];

        context.newColumnInfo.headers = [];
        context.newColumnInfo.numberOfColumns = 0;

        for (let i = 0; i < indices.length; i++) {

            var index = indices[i];

            if (index < 0) {
                index += value.length;
            }

            if (index >= 0 && index < value.length) {

                result.push(value[index]);

                if (context.columnInfo.headers) {
                    context.newColumnInfo.headers.push(context.columnInfo.headers[index]);
                }

                context.newColumnInfo.numberOfColumns++;
            }
        }

        return result;
    }
}