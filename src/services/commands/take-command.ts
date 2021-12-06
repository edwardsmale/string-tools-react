import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class TakeCommand extends IndividualLineCommand {

    private taken: number = 0;
    
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
        else if (context.isArrayOfArrays) {

            return value.slice(0, n);
        }
        else {

            let result: string[] = [];

            for (let i = 0; i < value.length; i++) {

                this.taken++;

                if (this.taken <= n) {

                    result.push(value[i]);
                }
            }

            return result;
        }
    }
}