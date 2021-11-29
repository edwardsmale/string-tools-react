import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class TsvCommand implements Command {
    
    constructor(private services: Services) {

        this.services = services;
    }

    Name = "tsv"

    Help = {
        Desc: "Tab-separates text that has been split",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {
        
        context.newColumnInfo.headers = [];

        context.isArrayOfArrays = false;

        return { segments: ["Output the items in tab-separated format"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        context.newColumnInfo.headers = [];

        context.isArrayOfArrays = false;

        return [value.join("\t")];
    }
}