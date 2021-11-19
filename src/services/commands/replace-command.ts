import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class ReplaceCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
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

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        para = this.FormatPara(para);

        if (context.regex) {

            return this.textUtilsService.GlobalRegexReplace(value as string, context.regex, para);
        }
        else if (context.searchString) {

            return this.textUtilsService.GlobalStringReplace(value as string, context.searchString, para);
        }
        else {

            return value;
        }
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        para = this.FormatPara(para);

        let newValue: string[] = [];

        const length = value.length;

        if (context.regex) {

            const globalRegexReplace = this.textUtilsService.GlobalRegexReplace;

            for (let i = 0; i < length; i++) {

                newValue.push(globalRegexReplace(value[i], context.regex, para));
            }

            return newValue;
        }
        else if (context.searchString) {

            const globalStringReplace = this.textUtilsService.GlobalStringReplace;
            
            for (let i = 0; i < length; i++) {
                
                newValue.push(globalStringReplace(value[i], context.searchString, para));
            }

            return newValue;
        }
        else {
            
            return value;
        }
    }

    private FormatPara(para: string) {

        return this.textUtilsService.ReplaceBackslashTWithTab(para);
    }
}