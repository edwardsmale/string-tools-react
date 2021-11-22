import { Explanation, Command } from '../../interfaces/CommandInterfaces';
import { Context } from '../../interfaces/Context';
import { TextUtilsService } from '../text-utils.service';

export class FlatCommand implements Command {

    // This class is only called when generating the explanation.
    // The code to execute this command is in command.service.ts.

    constructor(private textUtilsService: TextUtilsService) {

        this.textUtilsService = textUtilsService;
    }    

    Explain(para: string, negated: boolean, context: Context): Explanation {

        const batchSize = this.textUtilsService.ParsePositiveInteger(para);

        if (!batchSize) {

            context.isArrayOfArrays = false;

            return { segments: ["Flatten into one array"] };

        } else {
            
            context.isArrayOfArrays = true;

            return { segments: ["Flatten into batches of", batchSize.toString()] }
        }
    }

    Execute(value: string[], para: string, negated: boolean, context: Context): string[] {
        
        throw "FlatCommand.Execute should not be called";
    }
}