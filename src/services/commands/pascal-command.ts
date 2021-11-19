import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class PascalCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

   Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Pascal-case the value(s)"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return this.ToPascalCase(value);    
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            result.push(this.ToPascalCase(value[i]));
        }

        return result;
    }

    ToPascalCase(value: string): string {

        const leadingWhitespace = this.textUtilsService.GetLeadingWhitespace(value);
        const trailingWhitespace = this.textUtilsService.GetTrailingWhitespace(value);

        let newValue = leadingWhitespace;

        newValue += value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word) {

            return word.toUpperCase();

          }).replace(/\s+/g, "");

        newValue += trailingWhitespace;

        return newValue;
    }
}