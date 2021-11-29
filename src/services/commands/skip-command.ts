import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class SkipCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }
    
    Name = "skip"

    Help = {
        Desc: "Skips the first N items",
        Para: [
            { name: "N", desc: "The number of items to skip" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        var n = parseInt(para, 10);

        if (isNaN(n)) {
            return { segments: ["Skip n items"] };
        } else {
            return { segments: ["Skip", n.toString(), "item" + (n === 1 ? "" : "s")] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        var n = parseInt(para, 10);

        if (isNaN(n)) {
            
            return value;
        }
        else {

            return n >= 0 ? value.slice(n) : value.slice(0, -n);
        }
    }
}