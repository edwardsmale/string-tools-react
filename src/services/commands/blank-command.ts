import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class BlankCommand extends IndividualLineCommand {

    Name = "blank"

    Help = {
        Desc: "Include blank lines only",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        if (negated) {
            return { segments: ["Exclude blank lines"] };   
        }
        else {
            return { segments: ["Only include blank lines"] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (!context.withIndices.length || context.withIndices.includes(i)) {

                const isBlank = this.services.textUtilsService.IsNullOrWhitespace(value[i]);

                if (isBlank === !negated) {
    
                    result.push(value[i]);
                }
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}