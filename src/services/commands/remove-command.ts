import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class RemoveCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }
    
    Name = "remove"

    Help = {
        Desc: "Removes text matching a regex",
        Para: [
            { name: "regex", desc: "A string defining the regex" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Remove text matching a regex"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        const regExp = new RegExp(para);

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].replace(regExp, ""));
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}