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

    Explain(para: string, negated: boolean, context: Context): Explanation {

        this.SetRegex(para, context);
        return { segments: ["Set the current regex to", para] };
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