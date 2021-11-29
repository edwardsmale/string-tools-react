import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class SearchCommand implements Command {

    constructor(private services: Services) {

        this.services = services;
    }
    
    Name = "search"

    Help = {
        Desc: "Sets the current search string",
        Para: [
            { name: "Search String", desc: "The search string to set" }
        ]
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        this.SetSearchString(para, context);
        return { segments: ["Set the current search string to", para] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        this.SetSearchString(para, context);
        return value;
    }

    private SetSearchString(para: string, context: Context) {

        context.searchString = para;
        context.regex = null;
    }
}