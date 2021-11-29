import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class RemoveTrailingCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "removeTrailing"

    Help = {
        Desc: "Removes the specified string from the end of each item, if present",
        Para: [
            { name: "string", desc: "" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Remove the specified string from the end of each line, if present"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (negated) {

            for (let i = 0; i < value.length; i++) {

                result.push(this.services.textUtilsService.EnsureTrailing(value[i], para));
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                result.push(this.services.textUtilsService.RemoveTrailing(value[i], para));
            }
        }

        return result;
    }
}