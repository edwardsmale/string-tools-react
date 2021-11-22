import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class TakeCommand implements Command {
    
    Name = "take"

    Help = {
        Desc: "Takes the first N items only",
        Para: [
            { name: "N", desc: "The number of items to take" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        var n = parseInt(para, 10);

        if (isNaN(n)) {
            return { segments: ["Take the first n items and ignore the rest"] };
        } else {
            return { segments: ["Take the first", n.toString(), "item" + (n === 1 ? "" : "s") + " only"] };
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        var n = parseInt(para, 10);

        if (isNaN(n)) {

            return value;
        }
        else {

            return n >= 0 ? value.slice(0, n) : value.slice(-n);
        }
    }
}