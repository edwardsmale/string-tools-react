import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class EnsureTrailingCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "ensureTrailing"

    Help = {
        Desc: "Ensures each item ends with the specified string",
        Para: [
            { name: "string", desc: "" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Ensure each item ends with the specified string"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (!negated) {

            for (let i = 0; i < value.length; i++) {

                if (context.withIndices.includes(i)) {

                    result.push(this.services.textUtilsService.EnsureTrailing(value[i], para));
                }
                else {

                    result.push(value[i]);
                }
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                if (context.withIndices.includes(i)) {
                    
                    result.push(this.services.textUtilsService.RemoveTrailing(value[i], para));
                }
                else {

                    result.push(value[i]);
                }
            }
        }

        return result;
    }
}