import { BlankCommand } from './commands/blank-command';
import { CamelCommand } from './commands/camel-command';
import { Command } from "../interfaces/CommandInterfaces";
import { CsvCommand } from './commands/csv-command';
import { DistinctCommand } from './commands/distinct-command';
import { EncloseCommand } from './commands/enclose-command';
import { EnsureLeadingCommand } from './commands/ensure-leading-command';
import { EnsureTrailingCommand } from './commands/ensure-trailing-command';
import { FlatCommand } from './commands/flat-command';
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
import { Services } from "./services";
import { SkipCommand } from './commands/skip-command';
import { SortCommand } from './commands/sort-command';
import { SplitCommand } from './commands/split-command';
import { TakeCommand } from './commands/take-command';
import { TrimCommand, TrimEndCommand, TrimStartCommand } from './commands/trim-command';
import { TsvCommand } from './commands/tsv-command';
import { UpperCommand } from './commands/upper-command';
import { WithCommand } from './commands/with-command';

export class CommandTypesService {

    constructor(private services: Services) {
        
        this.services = services;

        this.CreateCommandsMap();
    }

    private CommandsMap: { [key:string]: Command; } = {};

    CreateCommandsMap = (): void => {

        for (let i = 0; i < this.Commands.length; i++) {

            const command = this.Commands[i];

            this.CommandsMap[command.Name] = command;
        }
    }

    Commands: Command[] = [
        new BlankCommand(this.services),
        new CamelCommand(this.services),
        new CsvCommand(this.services),
        new DistinctCommand(this.services),
        new EncloseCommand(this.services),
        new EnsureLeadingCommand(this.services),
        new EnsureTrailingCommand(this.services),
        new FlatCommand(this.services),
        new HeaderCommand(this.services),
        new JoinCommand(this.services),
        new KebabCommand(this.services),
        new LowerCommand(this.services),
        new MatchCommand(this.services),        
        new NoopCommand(this.services),
        new PascalCommand(this.services),
        new PrintCommand(this.services),
        new RegexCommand(this.services),
        new RemoveCommand(this.services),
        new RemoveLeadingCommand(this.services),
        new RemoveTrailingCommand(this.services),
        new ReplaceCommand(this.services),
        new SearchCommand(this.services),
        new SelectCommand(this.services),
        new SkipCommand(this.services),
        new SortCommand(this.services),
        new SplitCommand(this.services),
        new TakeCommand(this.services),
        new TrimCommand(this.services),
        new TrimEndCommand(this.services),
        new TrimStartCommand(this.services),
        new TsvCommand(this.services),
        new UpperCommand(this.services),
        new WithCommand(this.services)        
    ];

    CreateCommand = (name: string): Command =>  {

        const cmd = this.CommandsMap[name];

        return cmd || this.CommandsMap["noop"];
    };
}