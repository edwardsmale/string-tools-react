import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class HeaderCommand implements Command {

   Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Treat the first array of items as a header row"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.newColumnInfo.headers = value;

        return value;
    }
}