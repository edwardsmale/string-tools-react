import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class EncloseCommand implements Command {

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const enclosingChars = this.getEnclosingChars(para);

        return { segments: ["Enclose each item in", enclosingChars.leftChar, "and", enclosingChars.rightChar] };
    }

    ExecuteScalar(value: string, para: string, negated: boolean, context: Context): string {
        
        const enclosingChars = this.getEnclosingChars(para);

        return enclosingChars.leftChar + value + enclosingChars.rightChar;
    }

    ExecuteArray(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        const enclosingChars = this.getEnclosingChars(para);

        return value.map(val => enclosingChars.leftChar + val + enclosingChars.rightChar);
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