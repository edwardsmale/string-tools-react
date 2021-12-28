import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class ReplaceCommand extends IndividualLineCommand {

    Name = "replace"

    Help = {
        Desc: "Replaces text that matches the current regex or search string",
        Para: [
            { name: "Replacement text", desc: "The text to replace the matching text with" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        para = this.FormatPara(para);

        if (context.regex) {

            return { segments: ["Replace text matching the regex", context.regex, "with", para] };
        } 
        else if (context.searchString) {

            return { segments: ["Replace", context.searchString, "with", para] };
        } 
        else {

            return { segments: ["*** This command only works if a regex or search string has been set by an earlier 'regex' or 'search' instruction."] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        para = this.FormatPara(para);

        let newValue: string[] = [];

        const length = value.length;

        if (context.regex) {

            const globalRegexReplace = this.services.textUtilsService.GlobalRegexReplace;

            for (let i = 0; i < length; i++) {

                if (!context.withIndices.length || context.withIndices.includes(i)) {

                    newValue.push(globalRegexReplace(value[i], context.regex, para));
                }
                else {

                    newValue.push(value[i]);
                }
            }

            return newValue;
        }
        else if (context.searchString) {

            const globalStringReplace = this.services.textUtilsService.GlobalStringReplace;
            
            for (let i = 0; i < length; i++) {
                
                if (!context.withIndices.length || context.withIndices.includes(i)) {
                    
                    newValue.push(globalStringReplace(value[i], context.searchString, para));
                }
                else {

                    newValue.push(value[i]);
                }
            }

            return newValue;
        }
        else {
            
            return value;
        }
    }

    private FormatPara(para: string) {

        return this.services.textUtilsService.ReplaceBackslashTWithTab(para);
    }
}