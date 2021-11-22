import { Context } from "./Context";

export interface ParsedCommand
{
    command: Command;
    para: string;
    negated: boolean;
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
    Execute(value: string[], para: string, negated: boolean, context: Context): string[];
    UpdateContext?(para: string, negated: boolean, context: Context): void;
}

export interface Explanation
{
    segments: string[];
}