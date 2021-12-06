import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class TrimCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "trim"

    Help = {
        Desc: "Trims leading and trailing whitespace",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trim leading and trailing whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].trim());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}

export class TrimStartCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }
    
    Name = "trimStart"

    Help = {
        Desc: "Trims leading whitespace",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trims leading whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].trimStart());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}

export class TrimEndCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "trimEnd"

    Help = {
        Desc: "Trims trailing whitespace",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trims trailing whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].trimEnd());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}