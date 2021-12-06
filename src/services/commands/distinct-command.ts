import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class DistinctCommand extends IndividualLineCommand {

    private seenValues: any = {};

    Name = "distinct"

    Help = {
        Desc: "Deletes any duplicate items",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Delete duplicates"] };
    }
    
    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {

        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                if (!this.seenValues[value[i]]) {

                    result.push(value[i]);

                    this.seenValues[value[i]] = "a";
                }
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}