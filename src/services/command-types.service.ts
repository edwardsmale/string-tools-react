import { TextUtilsService } from './text-utils.service';
import { SortService } from './sort.service';
import { ArrayService } from './array.service';
import { CommandParameter, Command } from "../interfaces/CommandInterfaces";
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

    FindCommand = (name: string): Command =>  {

        for (let i = 0; i < this.Commands.length; i++) {

            if (this.Commands[i].Name === name) {

                return this.Commands[i];
            }
        }

        return this.FindCommand("noop");
    };

    Commands: Command[] = [
        this.blankCommand,
        this.camelCommand,
        this.csvCommand,
        this.distinctCommand,
        this.encloseCommand,
        this.ensureLeadingCommand,
        this.ensureTrailingCcommand,
        this.flatCommand,
        this.headerCommand,
        this.joinCommand,
        this.kebabCommand,
        this.lowerCommand,
        this.matchCommand,
        this.noopCommand,
        this.pascalCommand,
        this.printCommand,
        this.regexCommand,
        this.removeCommand,
        this.removeLeadingCommand,
        this.removeTrailingCommand,
        this.replaceCommand,
        this.searchCommand,
        this.selectCommand,
        this.skipCommand,
        this.sortCommand,
        this.splitCommand,
        this.takeCommand,
        this.trimCommand,
        this.trimEndCommand,
        this.trimStartCommand,
        this.tsvCommand,
        this.upperCommand,
        this.withCommand
    ];
}