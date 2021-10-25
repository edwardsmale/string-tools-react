import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class BlankCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(negated: boolean): Explanation {

        if (negated) {
            return { segments: ["Filters to only include blank lines"] };
        }
        else {
            return { segments: ["Filters to only include non-blank lines"] };
        }
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value;  
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            const isBlank = this.textUtilsService.IsNullOrWhitespace(value[i]);

            if (isBlank === !negated) {

                result.push(value[i]);
            }
        }

        return result;
    }
}