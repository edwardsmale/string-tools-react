import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class JoinCommand extends IndividualLineCommand {
    
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
        
        const delimiter = this.GetDelimiter(para);

        if (context.withIndices.length) {

            let result: string[] = [];

            let joinees: string = "";

            let newHeaders: string[] = [];

            for (let i = 0; i < value.length; i++) {
    
                joinees += value[i];

                if (context.withIndices.includes(i) && context.withIndices.includes(i + 1)) {

                    joinees += delimiter;
                }
                else {

                    if (joinees) {

                        result.push(joinees);

                        joinees = "";

                        if (context.headers) {
                            
                            newHeaders.push(context.headers[i]);
                        }
                    }
                    else {

                        result.push(value[i]);
                    }
                }
            }

            context.headers = newHeaders;
    
            return result;
        }
        else {

            context.isArrayOfArrays = false;
            context.headers = [];

            return [value.join(delimiter)];
        }
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