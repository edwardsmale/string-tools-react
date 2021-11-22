import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class HeaderCommand implements Command {

   Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Treat the first array of items as a header row"] };
    }

    ExecuteScalar(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return value;
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        if (!context.newColumnInfo.headers) {
            context.newColumnInfo.headers = value;
        }

        return value;
    }
}