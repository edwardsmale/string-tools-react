import { Explanation, WholeInputCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SortCommand extends WholeInputCommand {

    Name = "sort"
    
    Help = {
        Desc: "Sorts the items",
        Para: [
            { name: "Column index(es) or header(s) (optional)", desc: "The columns to sort by" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const indices = this.services.text.ParseSortOrderIndices(
            para,
            context.headers
        );

        const descending = para.toLowerCase().indexOf("desc") !== -1;

        if (!indices.length) {

            if (context.isSplit) {
                
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

    Execute(value: string[][], para: string, negated: boolean, context: Context): string[][] {

        let indices = this.services.text.ParseSortOrderIndices(
            para,
            context.headers
        );

        const descending = this.services.text.ParseSortOrderIsDescending(para);

        if (!indices.length) {

            if (context.isSplit) {

                // TODO: Decide how to sort an array of arrays when no indices are specified.

                // For now just sort by index 0.

                indices = [{
                    index: 0,
                    descending: descending,
                    description: "the item at index 0"
                }];

                value = this.services.sort.SortArrayOfArrays(
                    value, 
                    indices,
                    context
                );
            }                   
            else {

                value = this.services.sort.SortArray(
                    value,
                    descending
                );
            }
        } 
        else {

            if (context.isSplit) {

                // Negative indices count back from the end.

                for (let i = 0; i < indices.length; i++) {

                    if (indices[i].index < 0 && value.length) {
                        indices[i].index += value[0].length;
                    }
                }

                value = this.services.sort.SortArrayOfArrays(
                    value, 
                    indices,
                    context
                );
            }
            else {

                value = this.services.sort.SortArray(
                    value,
                    descending
                );
            }
        }

        return value;
    }
}