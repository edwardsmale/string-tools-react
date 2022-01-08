import { Context } from "./Context";
import { Services } from '../services/services'

export interface ParsedCommand
{
    command: Command;
    para: string;
    negated: boolean;
    cumulativeHash: number;
    dataSizeAfterCommand: number;
}

export interface CommandParameter
{
    name: string;
    desc: string;
}

export interface CommandHelp
{
    Desc: string;
    Para: CommandParameter[];
}

export interface Command
{
    Name: string;
    Help: CommandHelp;
    Explain(para: string, negated: boolean, context: Context): Explanation;
    IsWholeInputCommand: boolean;
    IsNonUpdatingCommand: boolean;
}

export abstract class IndividualLineCommand implements Command
{
    constructor(protected services: Services) {

        this.services = services;
    }

    abstract Name: string;
    abstract Help: CommandHelp;
    abstract Explain(para: string, negated: boolean, context: Context): Explanation;
    abstract Execute(value: string[], para: string, negated: boolean, context: Context): string[];
    UpdateContext?(para: string, negated: boolean, context: Context): void { context.withIndices = []; };
    IsWholeInputCommand = false;
    IsNonUpdatingCommand: boolean = false;
}

export abstract class WholeInputCommand implements Command
{
    constructor(protected services: Services) {

        this.services = services;
    }
    
    abstract Name: string;
    abstract Help: CommandHelp;
    abstract Explain(para: string, negated: boolean, context: Context): Explanation;
    abstract Execute(value: string[][], para: string, negated: boolean, context: Context): string[][];
    IsWholeInputCommand = true;
    IsNonUpdatingCommand: boolean = false;
}

export interface Explanation
{
    segments: string[];
}