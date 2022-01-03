import { Context } from "../interfaces/Context";

export class ContextService {

    CreateContext(): Context {

        return {
            regex: null,
            searchString: null,
            headers: null,
            withIndices: [],
            isSplit: false
        };
    }

    CloneContext(context: Context): Context {

        return {

            regex: context.regex,
            searchString: context.searchString,
            headers: context.headers && [...context.headers],
            withIndices: [...context.withIndices],
            isSplit: context.isSplit
        };
    }
}