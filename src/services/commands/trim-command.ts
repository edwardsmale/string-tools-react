import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class TrimCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trim leading and trailing whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {
            result.push(value[i].trim());
        }

        return result;
    }
}

export class TrimStartCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trims leading whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {
            result.push(value[i].trimStart());            
        }

        return result;
    }
}

export class TrimEndCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trims trailing whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {
            result.push(value[i].trimEnd());            
        }

        return result;
    }
}