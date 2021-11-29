import { Command } from "../interfaces/CommandInterfaces";
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
import { Services } from "./services";

export class CommandTypesService {

    constructor(private services: Services) {
        
        this.services = services;
    }

    CreateCommand = (name: string): Command =>  {

        switch (name) {
            case "blank": return new BlankCommand(this.services);
            case "camel": return new CamelCommand(this.services);
            case "csv": return new CsvCommand(this.services);
            case "distinct": return new DistinctCommand(this.services);
            case "enclose": return new EncloseCommand(this.services);
            case "ensureleading": return new EnsureLeadingCommand(this.services);
            case "ensuretrailing": return new EnsureTrailingCommand(this.services);
            case "flat": return new FlatCommand(this.services);
            case "header": return new HeaderCommand(this.services);
            case "join": return new JoinCommand(this.services);
            case "kebab": return new KebabCommand(this.services);
            case "lower": return new LowerCommand(this.services);
            case "match": return new MatchCommand(this.services);
            case "pascal": return new PascalCommand(this.services);
            case "print": return new PrintCommand(this.services);
            case "regex": return new RegexCommand(this.services);
            case "remove": return new RemoveCommand(this.services);
            case "removeleading": return new RemoveLeadingCommand(this.services);
            case "removetrailing": return new RemoveTrailingCommand(this.services);
            case "replace": return new ReplaceCommand(this.services);
            case "search": return new SearchCommand(this.services);
            case "select": return new SelectCommand(this.services);
            case "skip": return new SkipCommand(this.services);
            case "sort": return new SortCommand(this.services);
            case "split": return new SplitCommand(this.services);
            case "take": return new TakeCommand(this.services);
            case "trim": return new TrimCommand(this.services);
            case "trimend": return new TrimEndCommand(this.services);
            case "trimstart": return new TrimStartCommand(this.services);
            case "tsv": return new TsvCommand(this.services);
            case "upper": return new UpperCommand(this.services);
            case "with": return new WithCommand(this.services);
            default: return new NoopCommand(this.services);
        }
    };

    Commands: Command[] = [
        new BlankCommand(this.services),
        new CamelCommand(this.services),
        new CsvCommand(this.services),
        new DistinctCommand(),
        new EncloseCommand(),
        new EnsureLeadingCommand(this.services),
        new EnsureTrailingCommand(this.services),
        new FlatCommand(this.services),
        new HeaderCommand(),
        new JoinCommand(this.services),
        new KebabCommand(this.services),
        new LowerCommand(this.services),
        new MatchCommand(),
        new NoopCommand(),
        new PascalCommand(this.services),
        new PrintCommand(this.services),
        new RegexCommand(),
        new RemoveCommand(),
        new RemoveLeadingCommand(this.services),
        new RemoveTrailingCommand(this.services),
        new ReplaceCommand(this.services),
        new SearchCommand(),
        new SelectCommand(this.services),
        new SkipCommand(),
        new SortCommand(this.services),
        new SplitCommand(this.services),
        new TakeCommand(),
        new TrimCommand(),
        new TrimEndCommand(),
        new TrimStartCommand(),
        new TsvCommand(this.services),
        new UpperCommand(),
        new WithCommand(this.services),
    ];
}