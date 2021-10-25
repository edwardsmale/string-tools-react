import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class RemoveLeadingCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(): Explanation {

        return { segments: ["Remove the specified string from the start of each line, if present"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value;  
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (negated) {

            for (let i = 0; i < value.length; i++) {

                result.push(this.textUtilsService.EnsureLeading(value[i], para));
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                result.push(this.textUtilsService.RemoveLeading(value[i], para));
            }
        }

        return result;
    }
}