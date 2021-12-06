import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class DistinctCommand implements Command {

    private seenValues: any;

    constructor(private services: Services) {

        this.services = services;

        this.seenValues = {};
    }

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