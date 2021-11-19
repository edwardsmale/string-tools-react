import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class TsvCommand implements Command {
    
    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Output the items in tab-separated format"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        context.newColumnInfo.headers = [];

        return this.textUtilsService.AsArray(value).join("\t");
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.newColumnInfo.headers = [];

        return [value.join("\t")];
    }
}