import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class JoinCommand implements Command {
    
    constructor(private services: Services) {

        this.services = services;
    }

    Name = "join"

    Help = {
        Desc: "Joins the items together",
        Para: [
            { name: "delimiter", desc: "The delimiter to insert between items." }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const formattedDelimiter = this.GetFormattedDelimiter(para);

        context.isArrayOfArrays = false;

        return { segments: ["Output items separated with", formattedDelimiter] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.columnInfo.headers = [];
        const delimiter = this.GetDelimiter(para);

        context.isArrayOfArrays = false;

        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i]);
            }
        }

        return [result.join(delimiter)];
    }

    private GetFormattedDelimiter(para: string) {
        
        const delimiter = this.GetDelimiter(para);

        return this.services.textUtilsService.FormatDelimiter(delimiter, true, false);
    }

    private GetDelimiter(para: string) {

        const defaultDelimiter = "";

        para = this.services.textUtilsService.ReplaceBackslashTWithTab(para);
        
        return para || defaultDelimiter;
    }
}