import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class RemoveLeadingCommand extends IndividualLineCommand {

    Name = "removeLeading"

    Help = {
        Desc: "Removes the specified string from the start of each item, if present",
        Para: [
            { name: "string", desc: "" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Remove the specified string from the start of each line, if present"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        if (negated) {

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