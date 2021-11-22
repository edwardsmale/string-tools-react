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

            if (this.CommandTypes[i].Command.Name === name) {

                return this.CommandTypes[i];
            }
        }

        return this.FindCommandType("noop");
    };

    CommandTypes: CommandType[] = [
        { Command: this.noopCommand },
        { Command: this.regexCommand },
        { Command: this.searchCommand },
        { Command: this.replaceCommand },
        { Command: this.splitCommand },
        { Command: this.distinctCommand },
        { Command: this.skipCommand },
        { Command: this.headerCommand },
        { Command: this.takeCommand },
        { Command: this.blankCommand },
        { Command: this.trimCommand },
        { Command: this.trimStartCommand },
        { Command: this.trimEndCommand },
        { Command: this.removeCommand },
        { Command: this.ensureLeadingCommand },
        { Command: this.ensureTrailingCcommand },
        { Command: this.removeLeadingCommand },
        { Command: this.removeTrailingCommand },
        { Command: this.camelCommand },
        { Command: this.pascalCommand },
        { Command: this.kebabCommand },
        { Command: this.upperCommand },
        { Command: this.lowerCommand },
        { Command: this.selectCommand },
        { Command: this.matchCommand },
        { Command: this.encloseCommand },
        { Command: this.tsvCommand },
        { Command: this.csvCommand },
        { Command: this.joinCommand },
        { Command: this.printCommand },
        { Command: this.withCommand },
        { Command: this.sortCommand },
        { Command: this.flatCommand }
    ];
}