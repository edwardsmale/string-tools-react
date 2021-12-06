import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class UpperCommand extends IndividualLineCommand {
    
    Name = "upper"

    Help = {
        Desc: "Upper-cases the item(s)",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Upper-case the value(s)"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].toUpperCase());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}