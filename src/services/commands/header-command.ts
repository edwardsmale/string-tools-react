import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { Services } from '../services';

export class HeaderCommand implements Command {

    private headersAcquired: boolean = false;
    private headers: string[] = [];

    constructor(private services: Services) {

        this.services = services;
    }
    
    Name = "header"

    Help = {
        Desc: "Treats the first array of items as a header row",
        Para: []
    }

    Explain(para: string, negated: boolean, context: Context): Explanation {

        return { segments: ["Treat the first array of items as a header row"] };
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        if (!this.headersAcquired) {

            this.headers = [];

            for (let i = 0; i < value.length; i++) {
            
                if (context.withIndices.includes(i)) {

                    this.headers.push(value[i]);
                }
            }
            
            context.columnInfo.headers = this.headers;

            this.headersAcquired = true;

            return [];
        }
        else {

            context.columnInfo.headers = this.headers;

            return value;
        }
    }
}