import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class SortCommand implements Command {

    // This class is only called when generating the explanation.
    // The code to execute this command is in command.service.ts.

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }    

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const indices = this.textUtilsService.ParseSortOrderIndices(
            para,
            context.columnInfo.headers
        );

        const descending = para.toLowerCase().indexOf("desc") !== -1;

        if (!indices.length) {

            if (context.isArrayOfArrays) {
                
                if (descending) {

                    return { segments: ["Sort by", "the item at index 0", "in", "descending", "order"] };
                }
                else {

                    return { segments: ["Sort by", "the item at index 0"] };
                }
            }
            else {
                
                if (descending) {

                    return { segments: ["Sort the items in descending order"] };
                }
                else {

                    return { segments: ["Sort the items"] };
                }
            }
        } 
        else {
            
            let positions: string[] = [];

            for (let i = 0; i < indices.length; i++) {

                positions.push(indices[i].description);
            }

            return { segments: ["Sort by", positions.join(", then by ")] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        throw "SortCommand.Execute should not be called";
    }
}