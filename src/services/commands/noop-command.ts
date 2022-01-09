import { Explanation, IndividualLineCommand } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';

export class NoopCommand extends IndividualLineCommand {
    
    Name = "noop"

    Help = {
        Desc: "",
        Para: []
    }

    IsNonUpdatingCommand: boolean = true;

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: [""] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return value;
    }
}