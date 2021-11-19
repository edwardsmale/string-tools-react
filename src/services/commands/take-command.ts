import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class TakeCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        var n = parseInt(para, 10);

        if (isNaN(n)) {
            return { segments: ["Take the first n items and ignore the rest"] };
        } else {
            return { segments: ["Take the first", n.toString(), "item" + (n === 1 ? "" : "s") + " only"] };
        }
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value;  
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        var n = parseInt(para, 10);

        if (isNaN(n)) {

            return value;
        }
        else {

            return n >= 0 ? value.slice(0, n) : value.slice(-n);
        }
    }
}