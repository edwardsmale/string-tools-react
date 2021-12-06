import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services'

export class EncloseCommand implements Command {
    
    constructor(private services: Services) {

        this.services = services;
    }

    Name = "enclose"

    Help = {
        Desc: "Puts the specified characters at the start and end of each item",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const enclosingChars = this.getEnclosingChars(para);

        return { segments: ["Enclose each item in", enclosingChars.leftChar, "and", enclosingChars.rightChar] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const enclosingChars = this.getEnclosingChars(para);

        let result: string[] = [];

        for (let i = 0; i < value.length; i++) {

            if (context.withIndices.includes(i)) {

                result.push(enclosingChars.leftChar + value[i] + enclosingChars.rightChar);
            }
            else {

                result.push(value[i]);
            }
        }

        return result;
    }

    private getEnclosingChars(para: string) {

        if (para.length === 0) {

            return { leftChar: "(", rightChar: ")" };

        } else if (para.length === 1) {

            return { leftChar: para[0], rightChar: para[0] };

        } else {

            return { leftChar: para[0], rightChar: para[1] };
        }
    }
}