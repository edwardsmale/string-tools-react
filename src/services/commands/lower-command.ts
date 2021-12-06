import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class LowerCommand extends IndividualLineCommand {

    Name = "lower"

    Help = {
        Desc: "Lower-cases the item(s)",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Lower-case the value(s)"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].toLowerCase());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}