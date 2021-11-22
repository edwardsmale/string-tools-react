import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class DistinctCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Delete duplicates"] };
    }
    
    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {

         // The implementation is in command.service.ts.

        return value;
    }
}