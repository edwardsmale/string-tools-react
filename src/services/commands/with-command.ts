import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class WithCommand implements Command {

    // This class is only called when generating the explanation.
    // The code to execute this command is in command.service.ts.

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }    
    
    Name = "with"

    Help = {
        Desc: "Selects a column to operate on; subsequent indented commands will operate on this column only",
        Para: [
            { name: "column", desc: "The index or header of the column to operate on" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

        const indices = this.textUtilsService.ParseIntegers(para);

        if (indices.some((i) => isNaN(i))) {

            return { segments: ["With the specified columns..."] };
        }
        else if (indices.some((i) => i < 0)) {

            let formattedIndices: string[] = [];

            for (let i = 0; i < indices.length; i++) {

                var formattedIndex = this.textUtilsService.FormatIndex(indices[i], true);

                formattedIndices.push(formattedIndex);
            }

            let positions = this.textUtilsService.FormatList(formattedIndices);

            return { segments: ["With the columns", positions, "..."] };
        }
        else {

            let positions = this.textUtilsService.FormatList(indices);

            if (indices.length > 1) {

                return { segments: ["With the items at indexes", positions, "..."] };
            }
            else {
                return { segments: ["With the items at index", positions, "..."] };
            }
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        throw "WithCommand.Execute should not be called";
    }
}