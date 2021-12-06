import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SelectCommand extends IndividualLineCommand {

    Name = "select"

    Help = {
        Desc: "Returns values at selected indices",
        Para: [{ name: "Column Indices", desc: "Zero-based. Negatives count back from the end." }]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        para = this.services.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

        const indices = this.services.textUtilsService.ParseIntegers(para);

        if (indices.some((i) => isNaN(i))) {

            return { segments: ["Get the specified columns"] };
        }
        else if (indices.some((i) => i < 0)) {

            let formattedIndices: string[] = [];

            for (let i = 0; i < indices.length; i++) {

                var formattedIndex = this.services.textUtilsService.FormatIndex(indices[i], true);

                formattedIndices.push(formattedIndex);
            }

            const positions = this.services.textUtilsService.FormatList(formattedIndices);

            return { segments: ["Get", positions] };
        }
        else {

            const positions = this.services.textUtilsService.FormatList(indices);

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

        let newHeaders: string[] = [];

        for (let i = 0; i < indices.length; i++) {

            var index = indices[i];

            if (context.columnInfo.headers) {

                newHeaders.push(context.columnInfo.headers[index]);
            }
        }

        context.columnInfo.headers = newHeaders;
        context.columnInfo.numberOfColumns = indices.length;

        context.withIndices = this.services.arrayService.CreateRange(
            0,
            context.columnInfo.numberOfColumns - 1
        )
    }

    private ParseIndices(para: string, context: Context) {

        const indicesWithHeadersReplaced  = this.services.textUtilsService.ReplaceHeadersWithIndexes(
            para,
            context.columnInfo.headers
        );

        let indices = this.services.textUtilsService.ParseIntegers(indicesWithHeadersReplaced);

        for (let i = 0; i < indices.length; i++) {

            while (indices[i] < 0) {

                indices[i] += context.columnInfo.numberOfColumns;
            }
        }

        return indices.filter(i => i >= 0 && i < context.columnInfo.numberOfColumns);
    }
}