import { Explanation, WholeInputCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class FlatCommand extends WholeInputCommand {

    Name = "flat"
    
    Help = {
        Desc: "Flattens the array of arrays, or creates batches of the specified size",
        Para: [
            { name: "Batch Size (optional)",
            desc: "If set, flattens into batches of this size"}
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const batchSize = this.services.text.ParsePositiveInteger(para);

        if (!batchSize) {

            context.isSplit = false;

            return { segments: ["Flatten into one array"] };

        } else {
            
            context.isSplit = true;

            return { segments: ["Flatten into batches of", batchSize.toString()] }
        }
    }

    Execute(value: string[][], para: string, negated: boolean, context: Context): string[][] {
        
        const batchSize = this.services.text.ParsePositiveInteger(para);

        if (!batchSize) {

            context.isSplit = false;

            return [value.flat()];            

        } else {
            
            context.isSplit = true;

            return this.services.array.Batch(value, batchSize);
        }
    }
}