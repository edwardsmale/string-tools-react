import * as BlankCommand from './commands/blank-command';
import * as CamelCommand from './commands/camel-command';
import * as CsvCommand from './commands/csv-command';
import * as DistinctCommand from './commands/distinct-command';
import * as EncloseCommand from './commands/enclose-command';
import * as EnsureLeadingCommand from './commands/ensure-leading-command';
import * as EnsureTrailingCommand from './commands/ensure-trailing-command';
import * as FlatCommand from './wholeInputCommands/flat-command';
import * as HeaderCommand from './commands/header-command';
import * as JoinCommand from './commands/join-command';
import * as KebabCommand from './commands/kebab-command';
import * as LowerCommand from './commands/lower-command';
import * as MatchCommand from './commands/match-command';
import * as NoopCommand from './commands/noop-command';
import * as PascalCommand from './commands/pascal-command';
import * as PrintCommand from './commands/print-command';
import * as RegexCommand from './commands/regex-command';
import * as RemoveCommand from './commands/remove-command';
import * as RemoveLeadingCommand from './commands/remove-leading-command';
import * as RemoveTrailingCommand from './commands/remove-trailing-command';
import * as ReplaceCommand from './commands/replace-command';
import * as SearchCommand from './commands/search-command';
import * as SelectCommand from './commands/select-command';
import * as SkipCommand from './commands/skip-command';
import * as SortCommand from './wholeInputCommands/sort-command';
import * as SplitCommand from './commands/split-command';
import * as TakeCommand from './commands/take-command';
import * as TrimCommands from './commands/trim-command';
import * as TsvCommand from './commands/tsv-command';
import * as UpperCommand from './commands/upper-command';
import * as WithCommand from './commands/with-command';

import { Command } from "../interfaces/CommandInterfaces";
import { Services } from "./services";

export class CommandTypesService {

    private registry: any;

    private allCommands: Command[];

    constructor(private services: Services) {
        
        this.services = services;

        this.registry = Object.assign({}, 
            BlankCommand, CamelCommand, CsvCommand, DistinctCommand, EncloseCommand, EnsureLeadingCommand,
            EnsureTrailingCommand, FlatCommand, HeaderCommand, JoinCommand, KebabCommand, LowerCommand,
            MatchCommand, NoopCommand, PascalCommand, PrintCommand, RegexCommand, RemoveCommand,
            RemoveLeadingCommand, RemoveTrailingCommand, ReplaceCommand, SearchCommand, SelectCommand, 
            SkipCommand, SortCommand, SplitCommand, TakeCommand, TrimCommands, TsvCommand, UpperCommand,
            WithCommand
        );

        this.allCommands = Object.keys(this.registry)
            .map(commandName => new this.registry[commandName](this.services));        
    }

    CreateCommand = (name: string): Command =>  {

        const commandName = 
            this.services.text.CapitaliseFirstLetter(name) +
            "Command";

        if (this.registry[commandName]) {

            return new this.registry[commandName](this.services);
        }
        else {

            return new this.registry["NoopCommand"](this.services);
        }
    };

    GetAllCommands = (): Command[] => {

        return this.allCommands;
    }
}