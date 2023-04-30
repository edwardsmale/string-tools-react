import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class TsvCommand extends IndividualLineCommand {
    
    Name = "tsv"

    Help = {
        Desc: "Tab-separates text that has been split",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {
        
        context.headers = [];

        context.isSplit = false;

        return { segments: ["Output the items in tab-separated format"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.headers = [];
        context.isSplit = false;

        if (!context.withIndices.length) {
            
            return [value.join("\t")];
        }
        else {

            let values: string[] = [];

            for (let i = 0; i < context.withIndices.length; i++) {

                const index = context.withIndices[i];

                values.push(value[index]);
            }

            return [values.join("\t")];
        }
    }
}