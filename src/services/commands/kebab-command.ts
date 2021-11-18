import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class KebabCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

   Explain(negated: boolean): Explanation {

        return { segments: ["Kebab-case the value(s)"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return this.ToKebabCase(value);    
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            result.push(this.ToKebabCase(value[i]));
        }

        return result;
    }

    ToKebabCase(value: string): string {

        const leadingWhitespace = this.textUtilsService.GetLeadingWhitespace(value);
        const trailingWhitespace = this.textUtilsService.GetTrailingWhitespace(value);

        let newValue = leadingWhitespace;

        newValue += value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {

            return index === 0 ? word.toLowerCase() : "-" + word.toLowerCase();

          }).replace(/\s+/g, "");

        newValue += trailingWhitespace;

        return newValue;
    }
}