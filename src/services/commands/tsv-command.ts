import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class TsvCommand implements Command {
    
    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {
        
        context.newColumnInfo.headers = [];

        context.isArrayOfArrays = false;

        return { segments: ["Output the items in tab-separated format"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.newColumnInfo.headers = [];

        context.isArrayOfArrays = false;

        return [value.join("\t")];
    }
}