import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class UpperCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Upper-case the value(s)"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            result.push(value[i].toUpperCase());
        }

        return result;
    }
}