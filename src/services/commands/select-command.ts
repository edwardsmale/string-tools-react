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

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const indices = this.ParseIndices(para, context);

        let result: string[] = [];

        for (let i = 0; i < indices.length; i++) {

            var index = indices[i];

            result.push(value[index]);
        }

        return result;
    }

    UpdateContext(para: string, negated: boolean, context: Context): void {

        const indices = this.ParseIndices(para, context);

        context.newColumnInfo.headers = [];
        context.newColumnInfo.numberOfColumns = 0;

        for (let i = 0; i < indices.length; i++) {

            var index = indices[i];

            if (context.columnInfo.headers) {

                context.newColumnInfo.headers.push(context.columnInfo.headers[index]);
            }

            context.newColumnInfo.numberOfColumns++;
        }        
    }

    private ParseIndices(para: string, context: Context) {

        const indicesWithHeadersReplaced  = this.textUtilsService.ReplaceHeadersWithIndexes(
            para,
            context.columnInfo.headers
        );

        let indices = this.textUtilsService.ParseIntegers(indicesWithHeadersReplaced);

        for (let i = 0; i < indices.length; i++) {

            if (indices[i] < 0) {

                indices[i] += context.columnInfo.numberOfColumns;
            }
        }

        return indices.filter(i => i >= 0 && i < context.columnInfo.numberOfColumns);
    }
}