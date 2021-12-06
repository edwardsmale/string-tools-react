import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class MatchCommand extends IndividualLineCommand {
    
    Name = "match"

    Help = {
        Desc: "Only include items which match a regex or search string",
        Para: [{ name: "Search String", desc: "The string which items must contain in order to be included" }]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        var searchString = para || context.searchString;

        if (!searchString && context.regex) {
            
            if (negated) {
                return { segments: ["Only include items which don't match the regex", context.regex] };
            } 
            else {
                return { segments: ["Only include items which match the regex", context.regex] };
            }            
        }
        else if (searchString) {

            if (negated) {
                return { segments: ["Only include items that don't contain", searchString] };
            } 
            else {
                return { segments: ["Only include items containing", searchString] };
            }
        }
        else {
            
            if (negated) {
                return { segments: ["Only include items that don't match a string or regex"] };
            } 
            else {
                return { segments: ["Only include items matching a string or regex"] };
            }
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const searchString = para || context.searchString;

        const includeSuccesses = !negated;

        if (context.isArrayOfArrays) {

            let match = true;

            if (!searchString && context.regex) {

                const regexp = new RegExp(context.regex);

                for (let i = 0; i < context.withIndices.length; i++) {

                    const index = context.withIndices[i];

                    if (regexp.test(value[index]) !== includeSuccesses) {

                        match = false;
                    }
                }
            }
            else {

                for (let i = 0; i < context.withIndices.length; i++) {

                    const index = context.withIndices[i];

                    if (value[index].includes(searchString as string) !== includeSuccesses) {

                        match = false;
                    }
                }
            }

            if (match) {
                return value;
            }
            else {
                return [];
            }
        }
        else {

            if (!searchString && context.regex) {

                const regexp = new RegExp(context.regex);

                return value.filter(function (val: string) { 
                    return regexp.test(val) === includeSuccesses; 
                });
            }
            else {

                return value.filter(function (val: string) { 
                    return val.includes(searchString as string) === includeSuccesses; 
                });
            }
        }
    }
}