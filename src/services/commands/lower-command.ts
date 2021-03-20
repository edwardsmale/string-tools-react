import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class LowerCommand implements Command {

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(): Explanation {

        return { explanation: "Lower-case the value(s)" };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value.toLowerCase();   
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            result.push(value[i].toLowerCase());
        }

        return result;
    }
}