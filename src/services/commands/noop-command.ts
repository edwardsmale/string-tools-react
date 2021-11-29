import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class NoopCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }
    
    Name = "noop"

    Help = {
        Desc: "",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: [""] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        return value;
    }
}