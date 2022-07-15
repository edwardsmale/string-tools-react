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

        if (context.isSplit) {

            var include = false;;

            if (includeSuccesses) {
                
                include = false;

                if (!searchString && context.regex) {

                    const regexp = this.services.regex.GetRegex(context.regex);

                    if (context.withIndices.length) {

                        for (let i = 0; i < context.withIndices.length; i++) {

                            const index = context.withIndices[i];

                            if (regexp.test(value[index])) {

                                include = true;
                                break;
                            }
                        }
                    }
                    else {

                        for (let i = 0; i < value.length; i++) {

                            if (regexp.test(value[i])) {

                                include = true;
                                break;
                            }
                        }
                    }
                }
                else {

                    if (context.withIndices.length) {

                        for (let i = 0; i < context.withIndices.length; i++) {

                            const index = context.withIndices[i];

                            if (value[index].includes(searchString as string)) {

                                include = true;
                                break;
                            }
                        }
                    }
                    else {

                        for (let i = 0; i < value.length; i++) {

                            if (value[i].includes(searchString as string)) {

                                include = true;
                                break;
                            }
                        }
                    }
                }
            }
            else {

                include = true;

                if (!searchString && context.regex) {

                    const regexp = this.services.regex.GetRegex(context.regex);

                    if (context.withIndices.length) {

                        for (let i = 0; i < context.withIndices.length; i++) {

                            const index = context.withIndices[i];

                            if (regexp.test(value[index])) {

                                include = false;
                                break;
                            }
                        }
                    }
                    else {

                        for (let i = 0; i < value.length; i++) {

                            if (regexp.test(value[i])) {

                                include = false;
                                break;
                            }
                        }
                    }
                }
                else {

                    if (context.withIndices.length) {

                        for (let i = 0; i < context.withIndices.length; i++) {

                            const index = context.withIndices[i];

                            if (value[index].includes(searchString as string)) {

                                include = false;
                                break;
                            }
                        }
                    }
                    else {

                        for (let i = 0; i < value.length; i++) {

                            if (value[i].includes(searchString as string)) {

                                include = false;
                                break;
                            }
                        }
                    }
                }
            }

            if (include) {
                return value;
            }
            else {
                return [];
            }
        }
        else {

            if (!searchString && context.regex) {

                const regexp = this.services.regex.GetRegex(context.regex);

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