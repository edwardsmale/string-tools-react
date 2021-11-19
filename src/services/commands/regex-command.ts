import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class RegexCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        this.SetRegex(para, context);
        return { segments: ["Set the current regex to", para] };
    }

    ExecuteScalar(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return this.ExecuteArray(value, para, negated, context);
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        this.SetRegex(para, context);
        return value;
    }

    private SetRegex(para: string, context: Context) {

        context.regex = para;
        context.searchString = null;
    }
}