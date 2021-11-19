import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class SearchCommand implements Command {

   Explain(para: string, negated: boolean, context: Context): Explanation {

        this.SetSearchString(para, context);
        return { segments: ["Set the current search string to", para] };
    }

    ExecuteScalar(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return this.ExecuteArray(value, para, negated, context);
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        this.SetSearchString(para, context);
        return value;
    }

    private SetSearchString(para: string, context: Context) {

        context.searchString = para;
        context.regex = null;
    }
}