import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class EnsureLeadingCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "ensureLeading"

    Help = {
        Desc: "Ensures each item starts with the specified string",
        Para: [
            { name: "string", desc: "" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Ensure each item starts with the specified string"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (!negated) {

            for (let i = 0; i < value.length; i++) {

                result.push(this.services.textUtilsService.EnsureLeading(value[i], para));
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                result.push(this.services.textUtilsService.RemoveLeading(value[i], para));
            }
        }

        return result;
    }
}