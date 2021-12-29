import { TextUtilsService } from './text-utils.service';
import { Context } from "../interfaces/Context";
import { ArrayService } from './array.service';

export class ContextService {

    constructor(private textUtilsService: TextUtilsService, private arrayService: ArrayService) {
        
        this.textUtilsService = textUtilsService;
        this.arrayService = arrayService;
    }

    CreateContext(): Context {

        return {
            regex: null,
            searchString: null,
            headers: null,
            withIndices: [],
            isArrayOfArrays: false
        };
    }

    CloneContext(context: Context): Context {

        return {

            regex: context.regex,
            searchString: context.searchString,
            headers: context.headers && [...context.headers],
            withIndices: [...context.withIndices],
            isArrayOfArrays: context.isArrayOfArrays
        };
    }
}