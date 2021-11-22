import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class MatchCommand implements Command {

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

        if (!searchString && context.regex) {

            return value.filter(function (val: string) { 
                return new RegExp(context.regex as string).test(val) === includeSuccesses; 
            });
        }
        else {

            return value.filter(function (val: string) { 
                return val.includes(searchString as string) === includeSuccesses; 
            });
        }
    }
}