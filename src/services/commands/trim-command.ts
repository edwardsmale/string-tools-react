import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class TrimCommand extends IndividualLineCommand {

    Name = "trim"

    Help = {
        Desc: "Trims leading and trailing whitespace",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trim leading and trailing whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].trim());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}

export class TrimStartCommand extends IndividualLineCommand {
    
    Name = "trimStart"

    Help = {
        Desc: "Trims leading whitespace",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trims leading whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].trimStart());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}

export class TrimEndCommand extends IndividualLineCommand {

    Name = "trimEnd"

    Help = {
        Desc: "Trims trailing whitespace",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Trims trailing whitespace"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(value[i].trimEnd());
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }
}