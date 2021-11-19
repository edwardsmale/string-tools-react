import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class JoinCommand implements Command {
    
    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const formattedDelimiter = this.GetFormattedDelimiter(para);

        return { segments: ["Output items separated with", formattedDelimiter] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string[] {

        return [this.ExecuteArray(this.textUtilsService.AsArray(value), para, negated, context)[0]];
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.newColumnInfo.headers = [];
        const delimiter = this.GetDelimiter(para);       

        return [value.join(delimiter)];
    }

    private GetFormattedDelimiter(para: string) {
        
        const delimiter = this.GetDelimiter(para);

        return this.textUtilsService.FormatDelimiter(delimiter, true, false);
    }

    private GetDelimiter(para: string) {

        const defaultDelimiter = "";

        para = this.textUtilsService.ReplaceBackslashTWithTab(para);
        
        return para || defaultDelimiter;
    }
}