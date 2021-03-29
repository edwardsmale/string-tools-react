import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class DistinctCommand implements Command {

    Explain(): Explanation {

        return { explanation: "Delete duplicates" };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
         return value;
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (!result.includes(value[i])) {
                result.push(value[i]);
            }
        }

        return result;
    }
}