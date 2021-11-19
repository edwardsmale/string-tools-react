import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class NoopCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Do nothing"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value;
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return value;
    }
}