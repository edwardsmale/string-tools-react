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
import { WithCommand } from './commands/with-command';
import { SortCommand } from './commands/sort-command';
import { FlatCommand } from './commands/flat-command';

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
        private flatCommand: FlatCommand,
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
        private sortCommand: SortCommand,
        private splitCommand: SplitCommand,
        private takeCommand: TakeCommand,
        private trimCommand: TrimCommand,
        private trimEndCommand: TrimEndCommand,
        private trimStartCommand: TrimStartCommand,
        private tsvCommand: TsvCommand,
        private upperCommand: UpperCommand,
        private withCommand: WithCommand) {

        this.blankCommand = blankCommand;
        this.camelCommand = camelCommand;
        this.contextService = contextService;
        this.distinctCommand = distinctCommand;
        this.encloseCommand = encloseCommand;
        this.ensureLeadingCommand = ensureLeadingCommand;
        this.ensureTrailingCcommand = ensureTrailingCcommand;
        this.flatCommand = flatCommand;
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
        this.sortCommand = sortCommand;
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
        this.withCommand = withCommand;
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
            desc: "",
            para: [],
            Command: this.noopCommand
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
            Command: this.regexCommand
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
            Command: this.searchCommand
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
            Command: this.replaceCommand
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
            Command: this.splitCommand
        },
        {   
            name: "distinct",
            desc: "Deletes any duplicate items",
            para: [],
            Command: this.distinctCommand
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
            Command: this.skipCommand
        },
        {
            name: "header",
            desc: "Treats the first array of items as a header row",
            para: [],
            Command: this.headerCommand
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
            Command: this.takeCommand
        },
        {
            name: "blank",
            desc: "Matches blank lines only",
            para: [],
            Command: this.blankCommand
        },
        {
            name: "trim",
            desc: "Trims leading and trailing whitespace",
            para: [],
            Command: this.trimCommand
        },
        {
            name: "trimStart",
            desc: "Trims leading whitespace",
            para: [],
            Command: this.trimStartCommand
        },
        {
            name: "trimEnd",
            desc: "Trims trailing whitespace",
            para: [],
            Command: this.trimEndCommand
        },
        {
            name: "remove",
            desc: "Removes text matching a regex",
            para: [],
            Command: this.removeCommand
        },
        {
            name: "ensureLeading",
            desc: "Ensures each item starts with the specified string",
            para: [],
            Command: this.ensureLeadingCommand
        },
        {
            name: "ensureTrailing",
            desc: "Ensures each item ends with the specified string",
            para: [],
            Command: this.ensureTrailingCcommand
        },
        {
            name: "removeLeading",
            desc: "Removes the specified string from the start of each item, if present",
            para: [],
            Command: this.removeLeadingCommand
        },
        {
            name: "removeTrailing",
            desc: "Removes the specified string from the end of each item, if present",
            para: [],
            Command: this.removeTrailingCommand
        },
        {
            name: "camel",
            desc: "Camel-cases the item(s)",
            para: [],
            Command: this.camelCommand
        },
        {
            name: "pascal",
            desc: "Pascal-cases the item(s)",
            para: [],
            Command: this.pascalCommand
        },
        {
            name: "kebab",
            desc: "Kebab-cases the item(s)",
            para: [],
            Command: this.kebabCommand
        },
        {
            name: "upper",
            desc: "Upper-cases the item(s)",
            para: [],
            Command: this.upperCommand
        },
        {
            name: "lower",
            desc: "Lower-cases the item(s)",
            para: [],
            Command: this.lowerCommand
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
            Command: this.selectCommand
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
            Command: this.matchCommand
        },
        {
            name: "enclose",
            desc: "Puts the specified characters at the start and end of each item",
            para: [],
            Command: this.encloseCommand
        },
        {
            name: "tsv",
            desc: "Tab-separates text that has been split.",
            para: [],
            Command: this.tsvCommand
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
            Command: this.csvCommand
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
            Command: this.joinCommand
        },
        {
            name: "print",
            desc: "Prints output",
            para: [{ name: "<text>", desc: "What to print." }],
            Command: this.printCommand
        },
        {
            name: "with",
            desc: "Selects which parts of the results to operate on",
            para: [],
            Command: this.withCommand
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
            Command: this.sortCommand
        },
        {
            name: "flat",
            desc: "Flattens an array of arrays into one array, or into batches of a specified size",
            para: [{
                name: "Batch Size",
                desc: "If set, flattens into batches of this size"
            }],
            Command: this.flatCommand
        }
    ];
}