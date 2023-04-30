import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class RegexCommand extends IndividualLineCommand {
    
    Name = "regex"

    Help = {
        Desc: "Sets the current regex",
        Para: [
            { name: "Regex", desc: "A string defining the regex" }
        ]
    }
    
    IsNonUpdatingCommand: boolean = true;

    Explain(para: string, negated: boolean, context: Context): Explanation {

        this.SetRegex(para, context);

        if (this.services.regex.IsValidRegex(para)) {
            return { segments: ["Set the current regex to", para] };
        }
        else {
            return { segments: ["Set the current regex to", para, "!!INVALID REGEX!!"] }; 
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        this.SetRegex(para, context);
        return value;
    }

    private SetRegex(para: string, context: Context) {

        context.regex = para;
        context.searchString = null;
    }
}