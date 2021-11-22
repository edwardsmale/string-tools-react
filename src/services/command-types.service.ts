import { TextUtilsService } from './text-utils.service';
import { SortService } from './sort.service';
import { ArrayService } from './array.service';
import { CommandParameter, CommandType } from "../interfaces/CommandInterfaces";
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
import { NoopCommand } from './commands/noop-command';
import { PascalCommand } from './commands/pascal-command';
import { PrintCommand } from './commands/print-command';
import { RegexCommand } from './commands/regex-command';
import { RemoveCommand } from './commands/remove-command';
import { RemoveLeadingCommand } from './commands/remove-leading-command';
import { RemoveTrailingCommand } from './commands/remove-trailing-command';
import { ReplaceCommand } from './commands/replace-command';
import { SearchCommand } from './commands/search-command';
import { SelectCommand } from './commands/select-command';
import { SplitCommand } from './commands/split-command';
import { SkipCommand } from './commands/skip-command';
import { TakeCommand } from './commands/take-command';
import { TrimCommand, TrimEndCommand, TrimStartCommand } from './commands/trim-command';
import { TsvCommand } from './commands/tsv-command';
import { UpperCommand } from './commands/upper-command';

export class CommandTypesService {

    constructor(
        private textUtilsService: TextUtilsService,
        private sortService: SortService,
        private arrayService: ArrayService,
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
        private noopCommand: NoopCommand,
        private pascalCommand: PascalCommand,
        private printCommand: PrintCommand,
        private regexCommand: RegexCommand,
        private removeCommand: RemoveCommand,
        private removeLeadingCommand: RemoveLeadingCommand,
        private removeTrailingCommand: RemoveTrailingCommand,
        private replaceCommand: ReplaceCommand,
        private searchCommand: SearchCommand,
        private selectCommand: SelectCommand,
        private skipCommand: SkipCommand,
        private splitCommand: SplitCommand,
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
        this.noopCommand = noopCommand;
        this.pascalCommand = pascalCommand;
        this.printCommand = printCommand;
        this.regexCommand = regexCommand;
        this.removeCommand = removeCommand;
        this.removeLeadingCommand = removeLeadingCommand;
        this.removeTrailingCommand = removeTrailingCommand;
        this.replaceCommand = replaceCommand;
        this.searchCommand = searchCommand;
        this.selectCommand = selectCommand;
        this.skipCommand = skipCommand;
        this.sortService = sortService;
        this.arrayService = arrayService;
        this.splitCommand = splitCommand;
        this.takeCommand = takeCommand;
        this.textUtilsService = textUtilsService;
        this.trimCommand = trimCommand;
        this.trimEndCommand = trimEndCommand;
        this.trimStartCommand = trimStartCommand;
        this.tsvCommand = tsvCommand;
        this.upperCommand = upperCommand;
    }

    FindCommandType = (name: string): CommandType =>  {

        for (let i = 0; i < this.CommandTypes.length; i++) {

            if (this.CommandTypes[i].name === name) {

                return this.CommandTypes[i];
            }
        }

        return this.FindCommandType("noop");
    };

    CommandTypes: CommandType[] = [
        {
            name: "noop",
            desc: "Does nothing",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {      

                    return this.noopCommand.Explain(para, negated, context);
                }
                else {

                    return this.noopCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {     

                    return this.regexCommand.Explain(para, negated, context);
                } 
                else {

                    return this.regexCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {            
                           
                    return this.searchCommand.Explain(para, negated, context);
                }
                else {

                    return this.searchCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {            
                           
                    return this.replaceCommand.Explain(para, negated, context);
                }
                else {

                    return this.replaceCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {     

                    return this.splitCommand.Explain(para, negated, context);
                }
                else {

                    return this.splitCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {   
            name: "distinct",
            desc: "Deletes any duplicate items",
            para: [],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.distinctCommand.Explain(para, negated, context);
                } 
                else {

                    return this.distinctCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {

                    return this.skipCommand.Explain(para, negated, context);
                }
                else {

                    return this.skipCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "header",
            desc: "Treats the first array of items as a header row",
            para: [ ],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {    

                    return this.headerCommand.Explain(para, negated, context);
                }
                else {

                    return this.headerCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {     

                    return this.takeCommand.Explain(para, negated, context);
                } 
                else {

                    return this.takeCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "blank",
            desc: "Matches blank lines only",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.blankCommand.Explain(para, negated, context);
                } 
                else {

                    return this.blankCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "trim",
            desc: "Trims leading and trailing whitespace",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.trimCommand.Explain(para, negated, context);
                }
                else {

                    return this.trimCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "trimStart",
            desc: "Trims leading whitespace",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.trimStartCommand.Explain(para, negated, context);
                } 
                else {

                    return this.trimStartCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "trimEnd",
            desc: "Trims trailing whitespace",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.trimEndCommand.Explain(para, negated, context);
                } 
                else {

                    return this.trimEndCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "remove",
            desc: "Removes text matching a regex",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.removeCommand.Explain(para, negated, context);
                } 
                else {

                    return this.removeCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "ensureLeading",
            desc: "Ensures each item starts with the specified string",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.ensureLeadingCommand.Explain(para, negated, context);
                }
                else {

                    return this.ensureLeadingCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "ensureTrailing",
            desc: "Ensures each item ends with the specified string",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.ensureTrailingCcommand.Explain(para, negated, context);
                } 
                else {

                    return this.ensureTrailingCcommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "removeLeading",
            desc: "Removes the specified string from the start of each item, if present",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.removeLeadingCommand.Explain(para, negated, context);
                } 
                else {

                    return this.removeLeadingCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "removeTrailing",
            desc: "Removes the specified string from the end of each item, if present",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.removeTrailingCommand.Explain(para, negated, context);
                } 
                else {

                    return this.removeTrailingCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "camel",
            desc: "Camel-cases the item(s)",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.camelCommand.Explain(para, negated, context);
                } 
                else {

                    return this.camelCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "pascal",
            desc: "Pascal-cases the item(s)",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.pascalCommand.Explain(para, negated, context);
                } 
                else {

                    return this.pascalCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "kebab",
            desc: "Kebab-cases the item(s)",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.kebabCommand.Explain(para, negated, context);
                } 
                else {

                    return this.kebabCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "upper",
            desc: "Upper-cases the item(s)",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.upperCommand.Explain(para, negated, context);
                } 
                else {

                    return this.upperCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "lower",
            desc: "Lower-cases the item(s)",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.lowerCommand.Explain(para, negated, context);
                } 
                else {

                    return this.lowerCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.selectCommand.Explain(para, negated, context);
                }
                else {

                    return this.selectCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.matchCommand.Explain(para, negated, context);
                }
                else {

                    return this.matchCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "enclose",
            desc: "Puts the specified characters at the start and end of each item",
            para: [],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.encloseCommand.Explain(para, negated, context);
                }
                else {

                    return this.encloseCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "tsv",
            desc: "Tab-separates text that has been split.",
            para: [],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {
                    
                    return this.tsvCommand.Explain(para, negated, context);
                }
                else {

                    return this.tsvCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                if (explain) {
                    
                    return this.csvCommand.Explain(para, negated, context);
                } 
                else {

                    return this.csvCommand.Execute(value as string[], para, negated, context);
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {
                    
                    return this.joinCommand.Explain(para, negated, context);
                } 
                else {

                    return this.joinCommand.Execute(value as string[], para, negated, context);
                }              
            })
        },
        {
            name: "print",
            desc: "Prints output",
            para: [{ name: "<text>", desc: "What to print." }],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {
                
                if (explain) {
                    
                    return this.printCommand.Explain(para, negated, context);
                }
                else {

                    return this.printCommand.Execute(value as string[], para, negated, context);
                }
            })
        },
        {
            name: "with",
            desc: "Selects which parts of the results to operate on",
            para: [] as CommandParameter[],
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                // This code is only called when generating the explanation.
                // The code to execute this command is in command.service.ts.

                para = this.textUtilsService.ReplaceHeadersWithIndexes(para, context.columnInfo.headers);

                const indices = this.textUtilsService.ParseIntegers(para);

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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                const indices = this.textUtilsService.ParseSortOrderIndices(
                    para,
                    context.columnInfo.headers
                );

                const descending = para.toLowerCase().indexOf("desc") !== -1;

                if (!indices.length) {

                    if (context.isArrayOfArrays) {
                        
                        if (descending) {

                            return { segments: ["Sort by", "the item at index 0", "in", "descending", "order"] };
                        }
                        else {

                            return { segments: ["Sort by", "the item at index 0"] };
                        }
                    }
                    else {
                        
                        if (descending) {

                            return { segments: ["Sort the items in descending order"] };
                        }
                        else {

                            return { segments: ["Sort the items"] };
                        }
                    }
                } 
                else {
                    
                    let positions: string[] = [];

                    for (let i = 0; i < indices.length; i++) {

                        positions.push(indices[i].description);
                    }

                    return { segments: ["Sort by", positions.join(", then by ")] };
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
            exec: ((value: string[], para: string, negated: boolean, context: Context, explain: boolean) => {

                // This code is only called when generating the explanation.
                // The code to execute this command is in command.service.ts.

                const batchSize = this.textUtilsService.ParsePositiveInteger(para);

                if (!batchSize) {

                    context.isArrayOfArrays = false;

                    return { segments: ["Flatten into one array"] };

                } else {
                    
                    context.isArrayOfArrays = true;

                    return { segments: ["Flatten into batches of", batchSize.toString()] }
                }
            })
        }
    ];
}