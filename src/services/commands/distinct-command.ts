import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class DistinctCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Delete duplicates"] };
    }

    // Using an object and adding keys to it seems to be much faster than using Array.includes.
    
    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {

        let result: string[] = [];

        let obj: any = {};

        for (let i = 0; i < value.length; i++) {

            if (!obj[value[i]]) {

                obj[value[i]] = "a";

                result.push(value[i]);
            }
        }

        return result;
    }
}