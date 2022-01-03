import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SplitCommand extends IndividualLineCommand {
    
    Name = "split"

    Help = {
        Desc: "Splits the text up",
        Para: [
            { name: "Separator", desc: "The string on which to split" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        context.isSplit = true;

        if (!para && context.regex) {

            return { segments: ["Split the text using the regex", context.regex] };
        }
        else if (!para && context.searchString) {

            return { segments: ["Split the text on", context.searchString] };
        }
        else {

            var defaultDelimiter = ",";
            para = para === "\\t" ? "\t" : para;
            var delimiter = para || defaultDelimiter;

            var formattedDelimiter = this.services.textUtilsService.FormatDelimiter(delimiter, false, true);

            return { segments: ["Split the text on every", formattedDelimiter] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        if (context.isSplit) {

            if (context.withIndices.length) {

                let newWithIndices: number[] = [];
                let newHeaders: string[] = [];
                let columnCount: number = 0;

                let result = [];

                for (let i = 0; i < value.length; i++) {
        
                    if (context.withIndices.includes(i)) {
        
                        const split = this.splitScalar(value[i], para, negated, context);
        
                        for (let j = 0; j < split.length; j++) {

                            result.push(split[j]);
                            newWithIndices.push(columnCount);
                            
                            if (context.headers) {
                                newHeaders.push(context.headers[i])
                            }

                            columnCount++;
                        }                        
                    }
                    else {
        
                        result.push(value[i]);
                            
                        if (context.headers) {
                            newHeaders.push(context.headers[i])
                        }                        

                        columnCount++;
                    }
                }

                context.headers = newHeaders;
                context.withIndices = newWithIndices;

                return result;
            }
            else {

                let newHeaders: string[] = [];

                let result = [];

                for (let i = 0; i < value.length; i++) {
        
                    const split = this.splitScalar(value[i], para, negated, context);
    
                    for (let j = 0; j < split.length; j++) {

                        result.push(split[j]);
                        
                        if (context.headers) {
                            newHeaders.push(context.headers[i])
                        }
                    }                   
                }

                context.headers = newHeaders;

                return result;
            }
        }
        else if (value.length === 1 && para.length === 1 && !"|^$*()\\/[].+".includes(para)) {

            context.isSplit = true;
            context.headers = null;
            context.withIndices = [];
    
            return value[0].split(para);
        }
        else {

            let result = [];

            for (let i = 0; i < value.length; i++) {
      
                const split = this.splitScalar(value[i], para, negated, context);
        
                result.push(...split);
            }

            context.isSplit = true;
            context.headers = null;
            context.withIndices = [];
    
            return result;
        }
    }

    UpdateContext(para: string, negated: boolean, context: Context): void {
        
    }

    private splitScalar(value: string, para: string, negated: boolean, context: Context): string[] {

        if (!para && context.regex) {

            return value.split(new RegExp(context.regex));
        }
        else if (!para && context.searchString) {

            return value.split(context.searchString);
        }
        else {

            const defaultDelimiter = ",";
            para = para === "\\t" ? "\t" : para;
            let delimiter = para || defaultDelimiter;

            if (delimiter.length === 1 && "|^$*()\\/[].+".includes(delimiter)) {
                delimiter = "\\" + delimiter;
            }

            return this.services.textUtilsService.Split(value as string, delimiter);
        }
    }
}