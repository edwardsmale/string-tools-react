import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SkipCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        var n = parseInt(para, 10);

        if (isNaN(n)) {
            return { segments: ["Skip n items"] };
        } else {
            return { segments: ["Skip", n.toString(), "item" + (n === 1 ? "" : "s")] };
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

            return n >= 0 ? value.slice(n) : value.slice(0, -n);
        }
    }
}