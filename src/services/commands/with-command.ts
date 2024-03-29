import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class WithCommand extends IndividualLineCommand {
    
    Name = "with"

    Help = {
        Desc: "Selects a column to operate on; subsequent indented commands will operate on this column only",
        Para: [
            { name: "column", desc: "The index or header of the column to operate on" }
        ]
    }

    IsNonUpdatingCommand: boolean = true;

    Explain(para: string, negated: boolean, context: Context): Explanation {

        if (para === "*") {

            return { segments: ["With all the columns..."] };
        }

        const indices = this.services.text.ParseIndices(para, context.headers);

        if (indices.some((i) => isNaN(i))) {

            return { segments: ["With the specified columns..."] };
        }
        else if (indices.some((i) => i < 0)) {

            let formattedIndices: string[] = [];

            for (let i = 0; i < indices.length; i++) {

                var formattedIndex = this.services.text.FormatIndex(indices[i], true);

                formattedIndices.push(formattedIndex);
            }

            let positions = this.services.text.FormatList(formattedIndices);

            return { segments: ["With the columns", positions, "..."] };
        }
        else {

            const positions = this.services.text.FormatList(indices);

            if (indices.length > 1) {

                return { segments: ["With the items at indexes", positions, "..."] };
            }
            else {
                return { segments: ["With the items at index", positions, "..."] };
            }
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return value;
    }

    UpdateContext(para: string, negated: boolean, context: Context): void {

        if (context.isSplit) {

            context.withIndices = this.services.text.ParseIndices(para, context.headers);
        }
    }
}