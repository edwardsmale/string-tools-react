import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class RemoveLeadingCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "removeLeading"

    Help = {
        Desc: "Removes the specified string from the start of each item, if present",
        Para: [
            { name: "string", desc: "" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Remove the specified string from the start of each line, if present"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (negated) {

            for (let i = 0; i < value.length; i++) {

                if (context.withIndices.includes(i)) {

                    result.push(this.services.textUtilsService.EnsureLeading(value[i], para));
                }
                else {

                    result.push(value[i]);
                }
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                if (context.withIndices.includes(i)) {

                    result.push(this.services.textUtilsService.RemoveLeading(value[i], para));
                }
                else {

                    result.push(value[i]);
                }
            }
        }

        return result;
    }
}