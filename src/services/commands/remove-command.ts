import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class RemoveCommand implements Command {

   Explain(para: string, negated: boolean): Explanation {

        return { segments: ["Remove text matching a regex"] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        return value;  
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        const regExp = new RegExp(para);

        for (let i = 0; i < value.length; i++) {

            result.push(value[i].replace(regExp, ""));
        }

        return result;
    }
}