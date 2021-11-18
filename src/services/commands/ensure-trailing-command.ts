import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class EnsureTrailingCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

   Explain(para: string, negated: boolean): Explanation {

        return { segments: ["Ensure each item ends with the specified string"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value;  
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (!negated) {

            for (let i = 0; i < value.length; i++) {

                result.push(this.textUtilsService.EnsureTrailing(value[i], para));
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                result.push(this.textUtilsService.RemoveTrailing(value[i], para));
            }
        }

        return result;
    }
}