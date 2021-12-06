import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class CamelCommand extends IndividualLineCommand {

    Name = "camel"

    Help = {
        Desc: "Camel-cases the item(s)",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Camel-case the value(s)"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(this.ToCamelCase(value[i]));
            }
            else {
                
                result.push(value[i]);
            }
        }

        return result;
    }

    private ToCamelCase(value: string): string {

        const leadingWhitespace = this.services.textUtilsService.GetLeadingWhitespace(value);
        const trailingWhitespace = this.services.textUtilsService.GetTrailingWhitespace(value);

        let newValue = leadingWhitespace;

        newValue += value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {

            return index === 0 ? word.toLowerCase() : word.toUpperCase();

        }).replace(/\s+/g, "");

        newValue += trailingWhitespace;

        return newValue;
    }
}