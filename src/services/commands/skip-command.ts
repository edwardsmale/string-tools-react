import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class SkipCommand implements Command {

    private skipped: number = 0;

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
        else if (context.isArrayOfArrays) {

            return value.slice(n);
        } 
        else if (this.skipped > n) {
            
            return value;
        }
        else {

            let result: string[] = [];

            for (let i = 0; i < value.length; i++) {

                this.skipped++;

                if (this.skipped > n) {

                    result.push(value[i]);
                }
            }

            return result;
        }
    }
}