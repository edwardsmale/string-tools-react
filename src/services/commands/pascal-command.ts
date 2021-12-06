import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class PascalCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }

    Name = "pascal"

    Help = {
        Desc: "Pascal-cases the item(s)",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Pascal-case the value(s)"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(this.ToPascalCase(value[i]));
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }

    private ToPascalCase(value: string): string {

        const leadingWhitespace = this.services.textUtilsService.GetLeadingWhitespace(value);
        const trailingWhitespace = this.services.textUtilsService.GetTrailingWhitespace(value);

        let newValue = leadingWhitespace;

        newValue += value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word) {

            return word.toUpperCase();

          }).replace(/\s+/g, "");

        newValue += trailingWhitespace;

        return newValue;
    }
}