import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SelectCommand extends IndividualLineCommand {

    Name = "select"

    Help = {
        Desc: "Returns values at selected indices",
        Para: [{ name: "Column Indices", desc: "Zero-based. Negatives count back from the end." }]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const indices = this.services.text.ParseIndices(para, context.headers);

        if (indices.some((i) => isNaN(i))) {

            return { segments: ["Get the specified columns"] };
        }
        else if (indices.some((i) => i < 0)) {

            let formattedIndices: string[] = [];

            for (let i = 0; i < indices.length; i++) {

                var formattedIndex = this.services.text.FormatIndex(indices[i], true);

                formattedIndices.push(formattedIndex);
            }

            const positions = this.services.text.FormatList(formattedIndices);

            return { segments: ["Get", positions] };
        }
        else {

            const positions = this.services.text.FormatList(indices);

            if (indices.length > 1) {

                return { segments: ["Get the items at indexes", positions] };
            }
            else {
                return { segments: ["Get the items at index", positions] };
            }
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const indices = this.services.text.ParseIndices(para, context.headers);

        let result: string[] = [];

        for (let i = 0; i < indices.length; i++) {

            const index = indices[i];

            if (index >= 0 && index < value.length) {

                result.push(value[index]);
            }
        }

        return result;
    }

    UpdateContext(para: string, negated: boolean, context: Context): void {

        const indices = this.services.text.ParseIndices(para, context.headers);

        let newHeaders: string[] = [];

        for (let i = 0; i < indices.length; i++) {

            var index = indices[i];

            if (context.headers) {

                newHeaders.push(context.headers[index]);
            }
        }

        context.headers = newHeaders;

        context.withIndices = [];
    }
}