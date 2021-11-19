import { TextUtilsService } from './text-utils.service';
import { SortService } from './sort.service';
import { ScalarCommandType, ArrayCommandType, CommandParameter, SortCommandType, CommandType } from "../interfaces/CommandInterfaces";
import { Context } from "../interfaces/Context";
import { ContextService } from './context.service';
import { BlankCommand } from './commands/blank-command';
import { CamelCommand } from './commands/camel-command';
import { CsvCommand } from './commands/csv-command';
import { DistinctCommand } from './commands/distinct-command';
import { EncloseCommand } from './commands/enclose-command';
import { EnsureLeadingCommand } from './commands/ensure-leading-command';
import { EnsureTrailingCommand } from './commands/ensure-trailing-command';
import { HeaderCommand } from './commands/header-command';
import { JoinCommand } from './commands/join-command';
import { KebabCommand } from './commands/kebab-command';
import { LowerCommand } from './commands/lower-command';
import { MatchCommand } from './commands/match-command';
import { PascalCommand } from './commands/pascal-command';
import { PrintCommand } from './commands/print-command';
import { RegexCommand } from './commands/regex-command';
import { RemoveCommand } from './commands/remove-command';
import { RemoveLeadingCommand } from './commands/remove-leading-command';
import { RemoveTrailingCommand } from './commands/remove-trailing-command';
import { SearchCommand } from './commands/search-command';
import { SkipCommand } from './commands/skip-command';
import { TakeCommand } from './commands/take-command';
import { TrimCommand, TrimEndCommand, TrimStartCommand } from './commands/trim-command';
import { TsvCommand } from './commands/tsv-command';
import { UpperCommand } from './commands/upper-command';

export class CommandTypesService {

    constructor(private textUtilsService: TextUtilsService,
        private sortService: SortService,
        private contextService: ContextService,
        private blankCommand: BlankCommand,
        private camelCommand: CamelCommand,
        private csvCommand: CsvCommand,
        private distinctCommand: DistinctCommand,
        private encloseCommand: EncloseCommand,
        private ensureLeadingCommand: EnsureLeadingCommand,
        private ensureTrailingCcommand: EnsureTrailingCommand,
        private headerCommand: HeaderCommand,
        private joinCommand: JoinCommand,
        private kebabCommand: KebabCommand,
        private lowerCommand: LowerCommand,
        private matchCommand: MatchCommand,
        private pascalCommand: PascalCommand,
        private printCommand: PrintCommand,
        private regexCommand: RegexCommand,
        private removeCommand: RemoveCommand,
        private removeLeadingCommand: RemoveLeadingCommand,
        private removeTrailingCommand: RemoveTrailingCommand,
        private searchCommand: SearchCommand,
        private skipCommand: SkipCommand,
        private takeCommand: TakeCommand,
        private trimCommand: TrimCommand,
        private trimEndCommand: TrimEndCommand,
        private trimStartCommand: TrimStartCommand,
        private tsvCommand: TsvCommand,
        private upperCommand: UpperCommand) {

        this.blankCommand = blankCommand;
        this.camelCommand = camelCommand;
        this.contextService = contextService;
        this.distinctCommand = distinctCommand;
        this.encloseCommand = encloseCommand;
        this.ensureLeadingCommand = ensureLeadingCommand;
        this.ensureTrailingCcommand = ensureTrailingCcommand;
        this.headerCommand = headerCommand;
        this.joinCommand = joinCommand;
        this.kebabCommand = kebabCommand;
        this.lowerCommand = lowerCommand;
        this.matchCommand = matchCommand;
        this.pascalCommand = pascalCommand;
        this.printCommand = printCommand;
        this.regexCommand = regexCommand;
        this.removeCommand = removeCommand;
        this.removeLeadingCommand = removeLeadingCommand;
        this.removeTrailingCommand = removeTrailingCommand;
        this.searchCommand = searchCommand;
        this.skipCommand = skipCommand;
        this.sortService = sortService;
        this.takeCommand = takeCommand;
        this.textUtilsService = textUtilsService;
        this.trimCommand = trimCommand;
        this.trimEndCommand = trimEndCommand;
        this.trimStartCommand = trimStartCommand;
        this.tsvCommand = tsvCommand;
        this.upperCommand = upperCommand;
    }

    FindCommandType = (name: string): CommandType | SortCommandType =>  {

        for (let i = 0; i < this.CommandTypes.length; i++) {

            if (this.CommandTypes[i].name === name) {

                return this.CommandTypes[i];
            }
        }

        return this.FindCommandType("noop");
    };

    CommandTypes: (ScalarCommandType | ArrayCommandType | SortCommandType)[] = [
        {
            name: "noop",
            desc: "Does nothing",
            para: [] as CommandParameter[],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                if (explain) {
                    return { segments: [] };
                } else {
                    return value;
                }
            })
        },
        {
            name: "regex",
            desc: "Sets the current regex",
            para: [
                {
                    name: "Regex",
                    desc: "String defining the regex"
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {                    
                    return this.regexCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.regexCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.regexCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "search",
            desc: "Sets the current search string",
            para: [
                {
                    name: "Search String",
                    desc: "The search string to set"
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {                    
                    return this.searchCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.searchCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.searchCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "replace",
            desc: "Replaces text that matches the current regex or search string",
            para: [
                {
                    name: "Replacement text",
                    desc: "The text to replace the matching text with"
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                para = this.textUtilsService.ReplaceBackslashTWithTab(para);

                if (explain) {
                    if (context.regex) {
                        return { segments: ["Replace text matching the regex", context.regex, "with", para] };
                    } else if (context.searchString) {
                        return { segments: ["Replace", context.searchString, "with", para] };
                    } else {
                        return { segments: ["*** This command only works if a regex or search string has been set by an earlier 'regex' or 'search' instruction."] };
                    }
                } else {
                    if (Array.isArray(value)) {
                        let newValue: string[] = [];
                        const length = (value as string[]).length;

                        if (context.regex) {

                            const globalRegexReplace = this.textUtilsService.GlobalRegexReplace;

                            for (let i = 0; i < length; i++) {

                                newValue.push(globalRegexReplace(value[i], context.regex, para));
                            }

                            return newValue;
                        }
                        else if (context.searchString) {

                            const globalStringReplace = this.textUtilsService.GlobalStringReplace;
                            
                            for (let i = 0; i < length; i++) {
                                
                                newValue.push(globalStringReplace(value[i], context.searchString, para));
                            }

                            return newValue;

                        } else {
                            
                            return value;
                        }

                    } else {
                        if (context.regex) {
                            return this.textUtilsService.GlobalRegexReplace(value as string, context.regex, para);
                        } else if (context.searchString) {
                            return this.textUtilsService.GlobalStringReplace(value as string, context.searchString, para);
                        } else {
                            return value;
                        }
                    }
                }
            })
        },
        {
            name: "split",
            desc: "Splits up text.",
            para: [
                {
                    name: "Separator",
                    desc: "The string upon which to split."
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                value = this.textUtilsService.AsScalar(value);

                if (!para && context.regex) {

                    if (explain) {
                        return { segments: ["Split the text using the regex", context.regex] };
                    } else {
                        return (value as string).split(new RegExp(context.regex));
                    }
                }
                else if (!para && context.searchString) {

                    if (explain) {
                        return { segments: ["Split the text on", context.searchString] };
                    } else {
                        return (value as string).split(context.searchString);
                    }
                }
                else {
                    var defaultDelimiter = ",";
                    para = para === "\\t" ? "\t" : para;
                    var delimiter = para || defaultDelimiter;

                    if (explain) {

                        var formattedDelimiter = this.textUtilsService.FormatDelimiter(delimiter, false, true);

                        return { segments: ["Split the text on every", formattedDelimiter] };

                    } else {

                        if (delimiter.length === 1 && "|^$*()\\/[].+".includes(delimiter)) {
                            delimiter = "\\" + delimiter;
                        }

                        var splitValues = this.textUtilsService.Split(value as string, delimiter);

                        context.newColumnInfo.numberOfColumns = splitValues.length;
                        context.newColumnInfo.headers = null;

                        return splitValues;
                    }
                }
            })
        },
        {
            name: "sort",
            desc: "Sorts the items",
            para: [
                {
                    name: "index",
                    desc: "Index(es) of column to sort on"
                }
            ],
            isArrayBased: false,
            exec: ((value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => {

                const indices = this.textUtilsService.ParseSortOrderIndices(para, context.columnInfo.headers);

                const sortArray = this.sortService.SortArray;
                const sortArrays = this.sortService.SortArrays;

                if (!indices.length) {

                    const descending = para.toLowerCase().indexOf("desc") !== -1;
                    
                    if (explain) {
                        if (descending) {
                            return { segments: ["Sort the items in descending order"] };
                        }
                        else {
                            return { segments: ["Sort the items"] };
                        }
                    } else {
                        let sortedValues : string[];

                        if (value.length === 1 && Array.isArray(value[0])) {
                            
                            sortedValues = sortArray(value[0] as string[]);
                        } else {

                            sortedValues = sortArray(value as string[]);
                        }

                        if (descending) {
                            sortedValues = sortedValues.reverse();
                        }

                        return [sortedValues];
                    }
                } else {
                    
                    if (explain) {

                        let positions: string[] = [];

                        for (let i = 0; i < indices.length; i++) {

                            positions.push(indices[i].description);
                        }

                        return { segments: ["Sort by", positions.join(", then by ")] };

                    } else if (!para) {

                        return this.sortService.SortLines(value as string[]);

                    } else {

                        // Negative indexes count back from the end.
                        for (let i = 0; i < indices.length; i++) {

                            if (indices[i].index < 0) {
                                indices[i].index += value[0].length;
                            }
                        }

                        return sortArrays(
                            value as string[][], 
                            indices,
                            context
                        );
                    }
                }
            })
        },
        {   
            name: "distinct",
            desc: "Deletes any duplicate items",
            para: [],
            isArrayBased: true,
            exec: ((value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.distinctCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.distinctCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.distinctCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "skip",
            desc: "Skips the first N items",
            para: [
                {
                    name: "N",
                    desc: "How many items to skip"
                }
            ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {                    
                    return this.skipCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.skipCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.skipCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "header",
            desc: "Treats the first array of items as a header row",
            para: [ ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {                    
                    return this.headerCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.headerCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.headerCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "take",
            desc: "Takes the first N items and ignores the rest",
            para: [
                {
                    name: "N",
                    desc: "How many items to take"
                }
            ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {                    
                    return this.takeCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.takeCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {
                    return this.takeCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "blank",
            desc: "Matches blank lines only",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.blankCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.blankCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.blankCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "trim",
            desc: "Trims leading and trailing whitespace",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.trimCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.trimCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.trimCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "trimStart",
            desc: "Trims leading whitespace",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.trimStartCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.trimStartCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.trimStartCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "trimEnd",
            desc: "Trims trailing whitespace",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.trimEndCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.trimEndCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.trimEndCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "remove",
            desc: "Removes text matching a regex",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.removeCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.removeCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.removeCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "ensureLeading",
            desc: "Ensures each item starts with the specified string",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.ensureLeadingCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.ensureLeadingCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.ensureLeadingCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "ensureTrailing",
            desc: "Ensures each item ends with the specified string",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.ensureTrailingCcommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.ensureTrailingCcommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.ensureTrailingCcommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "removeLeading",
            desc: "Removes the specified string from the start of each item, if present",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.removeLeadingCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.removeLeadingCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.removeLeadingCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "removeTrailing",
            desc: "Removes the specified string from the end of each item, if present",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.removeTrailingCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.removeTrailingCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.removeTrailingCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "camel",
            desc: "Camel-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.camelCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.camelCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.camelCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "pascal",
            desc: "Pascal-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.pascalCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.pascalCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.pascalCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "kebab",
            desc: "Kebab-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.kebabCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.kebabCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.kebabCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "upper",
            desc: "Upper-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.upperCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.upperCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.upperCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "lower",
            desc: "Lower-cases the item(s)",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.lowerCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.lowerCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.lowerCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "with",
            desc: "Selects which parts of the results to operate on",
            para: [] as CommandParameter[],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

                const indices = this.textUtilsService.ParseIntegers(para);

                if (explain) {
                    if (indices.some((i) => isNaN(i))) {

                        return { segments: ["With the specified columns..."] };
                    }
                    else if (indices.some((i) => i < 0)) {

                        let formattedIndices: string[] = [];

                        for (let i = 0; i < indices.length; i++) {

                            var formattedIndex = this.textUtilsService.FormatIndex(indices[i], true);

                            formattedIndices.push(formattedIndex);
                        }

                        let positions = this.textUtilsService.FormatList(formattedIndices);

                        return { segments: ["With the columns", positions, "..."] };
                    }
                    else {

                        let positions = this.textUtilsService.FormatList(indices);

                        if (indices.length > 1) {

                            return { segments: ["With the items at indexes", positions, "..."] };
                        }
                        else {
                            return { segments: ["With the items at index", positions, "..."] };
                        }
                    }
                } else {

                    return value;
                }
            })
        },
        {
            name: "select",
            desc: "Returns values at selected indices.",
            para: [
                {
                    name: "Column Indices",
                    desc: "Zero-based. Negatives count back from the end."
                }
            ],
            isArrayBased: true,
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

                const indices = this.textUtilsService.ParseIntegers(para);

                if (explain) {

                    if (indices.some((i) => isNaN(i))) {

                        return { segments: ["Get the specified columns"] };
                    }
                    else if (indices.some((i) => i < 0)) {

                        let formattedIndices: string[] = [];

                        for (let i = 0; i < indices.length; i++) {

                            var formattedIndex = this.textUtilsService.FormatIndex(indices[i], true);

                            formattedIndices.push(formattedIndex);
                        }

                        let positions = this.textUtilsService.FormatList(formattedIndices);

                        return { segments: ["Get", positions] };
                    }
                    else {

                        let positions = this.textUtilsService.FormatList(indices);

                        if (indices.length > 1) {

                            return { segments: ["Get the items at indexes", positions] };
                        }
                        else {
                            return { segments: ["Get the items at index", positions] };
                        }
                    }
                } else {

                    let result: string[] = [];

                    context.newColumnInfo.headers = [];
                    context.newColumnInfo.numberOfColumns = 0;

                    for (let i = 0; i < indices.length; i++) {

                        var index = indices[i];

                        if (index < 0) {
                            index += value.length;
                        }

                        if (index >= 0 && index < value.length) {
                            result.push(value[index]);

                            if (context.columnInfo.headers) {
                                context.newColumnInfo.headers.push(context.columnInfo.headers[index]);
                            }

                            context.newColumnInfo.numberOfColumns++;
                        }
                    }

                    return result;
                }
            })
        },
        {
            name: "match",
            desc: "Only include items which match a regex or search string",
            para: [
                {
                    name: "Search String",
                    desc: "The string which items must contain in order to be included"
                }
            ],
            isArrayBased: true,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.matchCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.matchCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.matchCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "flat",
            desc: "Flattens an array of arrays into one array, or into batches of a specified size",
            para: [{
                name: "Batch Size",
                desc: "If set, flattens into batches of this size"
            }],
            isArrayBased: true,
            exec: ((value: (string | string[])[], para: string, negated: boolean, context: Context, explain: boolean) => {

                // This code is only called when generating the explanation.
                // The code to execute this command is in command.service.ts.
                if (this.textUtilsService.IsPositiveInteger(para)) {

                    return { segments: ["Flatten into batches of", para] };
                } 
                else {

                    return { segments: ["Flatten into one array"] };
                }
            })
        },
        {
            name: "enclose",
            desc: "Puts the specified characters at the start and end of each item",
            para: [],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.encloseCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.encloseCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.encloseCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "tsv",
            desc: "Tab-separates text that has been split.",
            para: [],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {
                    
                    return this.tsvCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.tsvCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.tsvCommand.ExecuteScalar(value as string, para, negated, context);
                }
            })
        },
        {
            name: "csv",
            desc: "Outputs the items in CSV format.",
            para: [
                {
                    name: "'",
                    desc: "Enclose values in single quotes."
                },
                {
                    name: '"',
                    desc: "Enclose values in double quotes."
                },
                {
                    name: "@",
                    desc:
                        "When values are enclosed in double quotes, precede " +
                        "opening double quotes with the @ symbol."
                },
                {
                    name: "\\",
                    desc:
                        "When values are enclosed in double quotes, escape " +
                        "any double quotes within values with a backslash."
                },
                {
                    name: "<anything else>",
                    desc: "The character(s) to use as the delimiter."
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.csvCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.csvCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.csvCommand.ExecuteScalar(value as string, para, negated, context);
                }   
            })
        },
        {
            name: "join",
            desc: "Joins a split line of text back together.",
            para: [
                {
                    name: "delimiter",
                    desc: "The delimiter to insert between items."
                }
            ],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {
                    
                    return this.joinCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.joinCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.joinCommand.ExecuteScalar(value as string, para, negated, context);
                }                
            })
        },
        {
            name: "print",
            desc: "Prints output",
            para: [{ name: "<text>", desc: "What to print." }],
            isArrayBased: false,
            exec: ((value: string | string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {
                    
                    return this.printCommand.Explain(para, negated, context);

                } else if (Array.isArray(value)) {

                    return this.printCommand.ExecuteArray(value as string[], para, negated, context);
                }
                else {

                    return this.printCommand.ExecuteScalar(value as string, para, negated, context);
                } 
            })
        }
    ];
}