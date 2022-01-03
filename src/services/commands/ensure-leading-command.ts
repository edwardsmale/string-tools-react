import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class EnsureLeadingCommand extends IndividualLineCommand {

    Name = "ensureLeading"

    Help = {
        Desc: "Ensures each item starts with the specified string",
        Para: [
            { name: "string", desc: "" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Ensure each item starts with the specified string"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (!negated) {

            for (let i = 0; i < value.length; i++) {

                if (!context.withIndices.length || context.withIndices.includes(i)) {

                    result.push(this.services.text.EnsureLeading(value[i], para));
                }
                else {
                    result.push(value[i]);
                }
            }
        }
        else {

            for (let i = 0; i < value.length; i++) {

                if (!context.withIndices.length || context.withIndices.includes(i)) {
                    
                    result.push(this.services.text.RemoveLeading(value[i], para));
                }
                else {
                    result.push(value[i]);
                }
            }
        }

        return result;
    }
}